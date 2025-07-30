/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly VITE_API_URL: string;
	readonly VITE_APP_NAME: string;
	readonly VITE_APP_VERSION: string;
	readonly VITE_ENABLE_DEVTOOLS: string;
	readonly VITE_ENABLE_MOCK_API: string;
	readonly VITE_GOOGLE_ANALYTICS_ID?: string;
	readonly VITE_SENTRY_DSN?: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
