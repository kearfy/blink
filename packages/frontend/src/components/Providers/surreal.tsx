import { surrealdbWasmEngines } from "@surrealdb/wasm";
import { type ReactNode, createContext, useContext } from "react";
import Surreal from "surrealdb";

export const SurrealContext = createContext<Surreal | null>(null);

const surreal = new Surreal({
	engines: surrealdbWasmEngines(),
});

await surreal.connect("indxdb://blink", {
	namespace: "blink",
	database: "blink",
});

export function SurrealProvider({ children }: { children: ReactNode }) {
	return (
		<SurrealContext.Provider value={surreal}>
			{children}
		</SurrealContext.Provider>
	);
}

export function useSurreal() {
	const surreal = useContext(SurrealContext);
	if (!surreal) throw new Error("No Surreal context");
	return surreal;
}
