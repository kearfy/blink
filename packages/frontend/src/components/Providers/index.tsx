import { surrealdbWasmEngines } from "@surrealdb/wasm";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import Surreal from "surrealdb";
import { SurrealProvider } from "./surreal";

const queryClient = new QueryClient();
const surrealClient = new Surreal({
	engines: surrealdbWasmEngines(),
});

import { MantineProvider } from "@mantine/core";
import { MANTINE_THEME } from "../../utils/mantine";

export function Providers({ children }: { children: ReactNode }) {
	return (
		<QueryClientProvider client={queryClient}>
			<SurrealProvider
				client={surrealClient}
				endpoint="indxdb://blink"
				params={{
					namespace: "blink",
					database: "blink",
				}}
			>
				<MantineProvider theme={MANTINE_THEME}>{children}</MantineProvider>
			</SurrealProvider>
		</QueryClientProvider>
	);
}
