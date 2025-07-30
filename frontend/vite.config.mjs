import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Component tagger plugin for development
const componentTagger = () => {
	return {
		name: "component-tagger",
		transform(code, id) {
			if (
				(process.env.NODE_ENV === "development" &&
					id.endsWith(".jsx")) ||
				id.endsWith(".tsx") ||
				(id.endsWith(".js") && code.includes("jsx")) ||
				(id.endsWith(".ts") && code.includes("tsx"))
			) {
				// Add data attributes to React components for easier debugging
				const componentRegex =
					/export\s+(?:default\s+)?(?:function|const)\s+([A-Z][A-Za-z0-9]*)/g;
				const matches = [...code.matchAll(componentRegex)];

				if (matches.length > 0) {
					const componentName = matches[0][1];
					const fileName = id.split("/").pop().split(".")[0];

					// Add development attributes
					code = code.replace(
						/(<[A-Z][A-Za-z0-9]*[^>]*?)(\s*>)/g,
						`$1 data-component="${componentName}" data-file="${fileName}"$2`
					);
				}
			}
			return code;
		},
	};
};

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		react({
			// Enable React DevTools in development
			include: "**/*.{jsx,tsx,js,ts}",
			babel: {
				plugins:
					process.env.NODE_ENV === "development"
						? [
								// Add component display names for better debugging
								[
									"babel-plugin-styled-components",
									{
										displayName: true,
										fileName: true,
									},
								],
						  ]
						: [],
			},
		}),
		// Add component tagger only in development
		process.env.NODE_ENV === "development" && componentTagger(),
	].filter(Boolean),

	// Development server configuration
	server: {
		port: 3000,
		open: true,
		host: true,
		// Proxy API requests to backend
		proxy: {
			"/api": {
				target: "http://localhost:5000",
				changeOrigin: true,
				secure: false,
			},
		},
	},

	// Build configuration
	build: {
		outDir: "build",
		sourcemap: true,
		// Optimize bundle
		rollupOptions: {
			output: {
				manualChunks: {
					vendor: ["react", "react-dom"],
					mui: ["@mui/material", "@mui/icons-material"],
					utils: ["axios", "date-fns"],
				},
			},
		},
	},

	// Environment variables
	define: {
		global: "globalThis",
	},

	// Resolve configuration
	resolve: {
		alias: {
			"@": "/src",
			"@components": "/src/components",
			"@pages": "/src/pages",
			"@services": "/src/services",
			"@contexts": "/src/contexts",
			"@utils": "/src/utils",
		},
	},

	// CSS configuration
	css: {
		devSourcemap: true,
	},

	// Test configuration
	test: {
		globals: true,
		environment: "jsdom",
		setupFiles: "./src/test/setup.ts",
		css: true,
	},
});
