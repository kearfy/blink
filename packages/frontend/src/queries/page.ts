import { useQuery } from "@tanstack/react-query";
import type { RecordId } from "surrealdb";
import { useSurrealClient } from "~/components/Providers/surreal";

export type Page = {
    id: RecordId<"page">;
    title: string;
    favorite: boolean;
    parent?: RecordId<"page">;
    content: unknown[];
    created: Date;
    updated: Date;
}

export type PageFilter = Partial<Pick<Page, "favorite" | "parent">>;

export function usePages({ filter }: { filter: PageFilter }) {
    const db = useSurrealClient();
    
    return useQuery<Page[]>({
        queryKey: ["page", "list", filter],
        queryFn: async () => {
            let query = "SELECT * FROM page";

            const filterString = Object
                .entries(filter)
                .map(([key, value]) => `${key} = ${value}`)
                .join(" AND ");

            if (filterString) {
                query += ` WHERE ${filterString}`;
            }

            const [pages] = await db.query<[Page[]]>(
                query,
                filter,
            );

            return pages;
        }
    });
}