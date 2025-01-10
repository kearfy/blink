import type { ReactNode } from "react";
import { SurrealProvider } from "./surreal";
import { surrealdbWasmEngines } from "@surrealdb/wasm";
import Surreal from "surrealdb";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();
const surrealClient = new Surreal({
    engines: surrealdbWasmEngines()
});

import { MANTINE_THEME } from "../../utils/mantine";
import { MantineProvider } from "@mantine/core";

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
                <MantineProvider theme={MANTINE_THEME}>
                    {children}
                </MantineProvider>
            </SurrealProvider>
        </QueryClientProvider>
	);
}
