import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
	plugins: [react()],
	resolve: {
		alias: {
			"~": fileURLToPath(new URL("src", import.meta.url)),
		},
	},
	css: {
		modules: {
			localsConvention: "dashesOnly",
		},
		preprocessorOptions: {
			scss: {
				api: "modern-compiler",
			},
		},
	},
});
