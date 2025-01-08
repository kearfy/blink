import "@mantine/core/styles.css";
import "@blocknote/mantine/style.css";
import "@blocknote/core/fonts/inter.css";
import "~/styles/global.scss";

import { MantineProvider } from "@mantine/core";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { MANTINE_THEME } from "./utils/mantine";
import { Layout } from "./components/Layout";

const root = document.getElementById("root");
if (!root) throw new Error("No root element");

createRoot(root).render(
	<StrictMode>
		<MantineProvider theme={MANTINE_THEME}>
			<Layout />
		</MantineProvider>
	</StrictMode>,
);
