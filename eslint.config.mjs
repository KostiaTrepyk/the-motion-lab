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
		},
		rules: {
			"react-compiler/react-compiler": "error",
		},
	},

	// 4. Игнорируем папки сборки, чтобы линтер там не копался
	globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),
]);

export default eslintConfig;
