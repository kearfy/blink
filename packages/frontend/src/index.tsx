import "@mantine/core/styles.css";
import "@blocknote/mantine/style.css";
import "@blocknote/core/fonts/inter.css";
import "~/styles/global.scss";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Layout } from "./components/Layout";
import { Providers } from "./components/Providers";

const root = document.getElementById("root");
if (!root) throw new Error("No root element");

createRoot(root).render(
	<StrictMode>
		<Providers>
			<Layout />
		</Providers>
	</StrictMode>,
);
