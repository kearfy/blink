import "@mantine/core/styles.css";
import "@blocknote/mantine/style.css";
import "@blocknote/core/fonts/inter.css";
import "~/styles/global.scss";

import { MantineProvider as Mantine } from "@mantine/core";
import type { ReactNode } from "react";
import { MANTINE_THEME } from "../../utils/mantine";

const root = document.getElementById("root");
if (!root) throw new Error("No root element");

export function MantineProvider({ children }: { children: ReactNode }) {
	return <Mantine theme={MANTINE_THEME}>{children}</Mantine>;
}
