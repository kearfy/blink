import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
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
	optimizeDeps: {
		exclude: ["@surrealdb/wasm"],
		esbuildOptions: {
			target: "esnext",
		},
	},
	esbuild: {
		supported: {
			"top-level-await": true,
		},
	},
});
