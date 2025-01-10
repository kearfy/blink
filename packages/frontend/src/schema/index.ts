import { useMutation } from "@tanstack/react-query";
import { type PreparedQuery, RecordId } from "surrealdb";
import { useSurrealClient } from "~/components/Providers/surreal";
import * as migrations from "./migrations";

type MigrationCurrentEntry = {
	id: RecordId<"migration">;
	version: number;
};

export function useMigrate() {
	const db = useSurrealClient();
	return useMutation({
		mutationKey: ["migrations"],
		mutationFn: async () => {
			const pointer = new RecordId("migration", "current");
			const res = await db.select<MigrationCurrentEntry>(pointer);
			const current = res?.version ?? 0;
			const todo = Object.entries(migrations)
				.map(
					([key, migration]) =>
						[Number.parseInt(key.slice(3)), migration] as const satisfies [
							number,
							PreparedQuery,
						],
				)
				.filter(([v]) => v > current);

			for (const [version, migration] of todo) {
				console.info(`[SCHEMA] Migrating to version ${version}`);
				await db.query(migration);
				console.info("[SCHEMA] Applied migration");
				await db.upsert(pointer, { version });
				console.info("[SCHEMA] Updated pointer");
			}

			return true;
		},
	});
}
