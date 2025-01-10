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
import { MigrationsProvider } from "./migrations";

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
				<MigrationsProvider>
					<MantineProvider theme={MANTINE_THEME}>{children}</MantineProvider>
				</MigrationsProvider>
			</SurrealProvider>
		</QueryClientProvider>
	);
}
