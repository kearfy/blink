import "~/styles/global.scss";
import "~/styles/fonts.scss";

import "@mantine/core/styles.css";
import "@blocknote/mantine/style.css";
import "@blocknote/core/fonts/inter.css";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Layout } from "./components/Layout";
import { Providers } from "./components/Providers";
import { LoadingScreen } from "./components/Screens/Loading";

const root = document.getElementById("root");
if (!root) throw new Error("No root element");

console.log(import.meta.env.BASE_URL);

createRoot(root).render(
	<StrictMode>
		<Providers>
			<LoadingScreen>
				<Layout />
			</LoadingScreen>
		</Providers>
	</StrictMode>,
);
