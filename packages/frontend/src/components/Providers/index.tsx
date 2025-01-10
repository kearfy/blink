import type { ReactNode } from "react";
import { MantineProvider } from "./mantine";
import { SurrealProvider } from "./surreal";
import { TanstackQueryProvider } from "./tanstack-query";

export function Providers({ children }: { children: ReactNode }) {
	return (
		<SurrealProvider>
			<TanstackQueryProvider>
				<MantineProvider>{children}</MantineProvider>
			</TanstackQueryProvider>
		</SurrealProvider>
	);
}
