import {
	type QueryClient,
	useMutation,
	useQuery,
	useQueryClient,
} from "@tanstack/react-query";
import { RecordId, surql } from "surrealdb";
import { useSurrealClient } from "~/components/Providers/surreal";

export type Page = {
	id: RecordId<"page">;
	title: string;
	favorite: boolean;
	parent?: RecordId<"page">;
	content: unknown[];
	created: Date;
	updated: Date;
};

export type PageWithNested = Page & { nested: PageWithNested[] };

export type PageFilter = Partial<Pick<Page, "favorite" | "parent">>;

export function usePages({ filter }: { filter: PageFilter }) {
	const db = useSurrealClient();

	return useQuery<Page[]>({
		queryKey: ["page", "list", filter],
		queryFn: async () => {
			let query = "SELECT * FROM page";

			const filterString = Object.entries(filter)
				.map(([key, value]) => `${key} = ${value}`)
				.join(" AND ");

			if (filterString) {
				query += ` WHERE ${filterString}`;
			}

			const [pages] = await db.query<[Page[]]>(query, filter);

			return pages;
		},
	});
}

export function useRecursivePages({ filter }: { filter: PageFilter }) {
	const db = useSurrealClient();

	return useQuery<PageWithNested[]>({
		queryKey: ["page", "list-recursive", filter],
		queryFn: async () => {
			let query = "LET $ids = SELECT VALUE id FROM page";

			const filterString = Object.entries(filter)
				.map(([key, value]) => `${key} = ${value}`)
				.join(" AND ");

			if (filterString) {
				query += ` WHERE ${filterString}`;
			}

			query +=
				"; $ids.{..}.{ id, title, favorite, parent, content, created, updated, nested: id.revs('page', 'parent').@ }";

			const [_, pages] = await db.query<[undefined, PageWithNested[]]>(
				query,
				filter,
			);

			return pages;
		},
	});
}

export function useNestedPages(id: string) {
	const db = useSurrealClient();

	return useQuery<Page[]>({
		queryKey: ["page", "list-nested", id],
		queryFn: async () => {
			const rid = new RecordId("page", id);
			const [pages] = await db.query<[Page[]]>(
				surql`SELECT * FROM ${rid}.refs('page', 'parent')`,
			);

			return pages;
		},
	});
}

export function usePage(id: string) {
	const db = useSurrealClient();

	return useQuery<Page | null>({
		queryKey: ["page", "fetch", id],
		queryFn: async () => {
			const rid = new RecordId("page", id);
			const page = await db.select<Page>(rid);
			return page ?? null;
		},
	});
}

export function useUpdatePage(id: string) {
	const db = useSurrealClient();
	const qc = useQueryClient();

	return useMutation<
		Page | null,
		Error,
		Partial<Pick<Page, "content" | "favorite" | "title" | "parent">>
	>({
		mutationKey: ["page", "list", id],
		mutationFn: async (payload) => {
			const rid = new RecordId("page", id);
			const [[page]] = await db.query<[(Page | undefined)[]]>(
				surql`UPDATE ${rid} MERGE ${payload}`,
			);

			if (page) {
				refetchPageQueries(qc);
				return page;
			}

			return null;
		},
	});
}

export function useCreatePage() {
	const db = useSurrealClient();
	const qc = useQueryClient();

	return useMutation<
		Page | null,
		Error,
		Partial<Pick<Page, "content" | "favorite" | "title" | "parent">>
	>({
		mutationKey: ["page", "create"],
		mutationFn: async (payload) => {
			const [page] = await db.create<Page, Pick<Page, "title" | "content">>(
				"page",
				{
					title: "",
					content: [],
					...payload,
				},
			);

			if (page) {
				refetchPageQueries(qc);
				return page;
			}

			return null;
		},
	});
}

export function useDeletePage() {
	const db = useSurrealClient();
	const qc = useQueryClient();

	return useMutation<boolean, Error, RecordId<"page">>({
		mutationKey: ["page", "delete"],
		mutationFn: async (id) => {
			const [[page]] = await db.query<[[Page | undefined]]>(
				surql`DELETE ${id} RETURN BEFORE`,
			);

			if (page) {
				refetchPageQueries(qc);
				return true;
			}

			return false;
		},
	});
}

function refetchPageQueries(qc: QueryClient) {
	qc.refetchQueries({
		predicate: (query) => query.queryKey[0] === "page",
	});
}
