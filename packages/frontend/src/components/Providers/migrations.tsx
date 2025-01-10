import type { UseMutationResult } from "@tanstack/react-query";
import { type ReactNode, createContext, useContext, useEffect } from "react";
import { useMigrate } from "~/schema";
import { useSurreal } from "./surreal";

const MigrationsContext = createContext<
	undefined | UseMutationResult<boolean, Error, void>
>(undefined);

export function MigrationsProvider({ children }: { children: ReactNode }) {
	const mut = useMigrate();
	const surreal = useSurreal();

	useEffect(() => {
		if (surreal.isSuccess) {
			mut.mutateAsync();
		}
	}, [mut.mutateAsync, surreal.isSuccess]);

	return (
		<MigrationsContext.Provider value={mut}>
			{children}
		</MigrationsContext.Provider>
	);
}

export function useMigrations() {
	const ctx = useContext(MigrationsContext);
	if (ctx === undefined) {
		throw new Error("useMigrations must be used within a MigrationsProvider");
	}
	return ctx;
}
