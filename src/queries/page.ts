import {
	type Query,
	type QueryClient,
	useMutation,
	useQuery,
	useQueryClient,
} from "@tanstack/react-query";
import { RecordId, surql } from "surrealdb";
import { useSurrealClient } from "~/components/Providers/surreal";
import type { Entries } from "~/utils/types";

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

export function usePages({
	filter,
	enabled,
}: { filter?: PageFilter; enabled?: boolean } = {}) {
	const db = useSurrealClient();

	return useQuery<Page[]>({
		queryKey: ["page", "list", filter],
		enabled,
		queryFn: async () => {
			let query = "SELECT * FROM page";

			const filterString = Object.entries(filter ?? {})
				.map(([key, value]) => `${key} = ${value}`)
				.join(" AND ");

			if (filterString) {
				query += ` WHERE ${filterString}`;
			}

			query += " ORDER BY updated DESC";

			const [pages] = await db.query<[Page[]]>(query, filter);

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
				updatePageInCache(qc, page);
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
				updatePageInCache(qc, page);
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
				removePageFromCache(qc, page);
				return true;
			}

			return false;
		},
	});
}

function createCachePredicate(page: Page) {
	return (query: Query) => {
		const key = query.queryKey;
		if (key[0] === "page") {
			switch (key[1]) {
				case "fetch": {
					if (key[2] === page.id.id) {
						return true;
					}

					break;
				}
				case "list": {
					const filter = key[2] as PageFilter;
					if (
						filter.parent &&
						page.parent &&
						filter.parent.toString() === page.parent.toString()
					) {
						return true;
					}

					for (const item of Object.entries(
						filter as PageFilter,
					) as Entries<PageFilter>) {
						if (!item) continue;
						if (page[item[0]] !== item[1]) {
							return false;
						}
					}

					return true;
				}
				case "list-nested": {
					if (key[2] === page.parent?.id) {
						return true;
					}

					break;
				}
			}
		}

		return false;
	};
}

function updatePageInCache(qc: QueryClient, page: Page) {
	qc.setQueriesData(
		{
			predicate: createCachePredicate(page),
		},
		(prev) => {
			if (Array.isArray(prev)) {
				const pages = prev as Page[];
				const filtered = pages.filter((p) => p.id.id !== page.id.id);
				return [...filtered, page].sort(
					(a, b) => b.updated.getTime() - a.updated.getTime(),
				);
			}

			return page;
		},
	);
}

function removePageFromCache(qc: QueryClient, page: Page) {
	qc.setQueriesData(
		{
			predicate: createCachePredicate(page),
		},
		(prev) => {
			if (Array.isArray(prev)) {
				const pages = prev as Page[];
				const filtered = pages.filter((p) => p.id.id !== page.id.id);
				return filtered;
			}

			return undefined;
		},
	);
}
