import fsdPlugin from "@conarti/eslint-plugin-feature-sliced";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import reactCompiler from "eslint-plugin-react-compiler";
import { defineConfig, globalIgnores } from "eslint/config";

const eslintConfig = defineConfig([
	// 1. Базовые правила Next.js (включают в себя базовый React и JS)
	...nextVitals,

	// 2. Базовые правила TypeScript для Next.js
	...nextTs,

	// 3. Дополнительные плагины
	{
		plugins: {
			"react-compiler": reactCompiler,
			"@conarti/feature-sliced": fsdPlugin,
		},
		rules: {
			"react-compiler/react-compiler": "error",
			"@typescript-eslint/consistent-type-imports": [
				"error",
				{
					prefer: "type-imports",
					fixStyle: "inline-type-imports", // Сделает import { type JSX } вместо import type { JSX }
				},
			],

			"@conarti/feature-sliced/layers-slices": "error",
			"@conarti/feature-sliced/absolute-relative": "error",
			"@conarti/feature-sliced/public-api": "error",
		},
	},

	// 4. Игнорируем папки сборки, чтобы линтер там не копался
	globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),
]);

export default eslintConfig;
