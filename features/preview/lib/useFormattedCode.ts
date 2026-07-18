import * as babelPlugin from "prettier/plugins/babel";
import * as estreePlugin from "prettier/plugins/estree";
import * as htmlPlugin from "prettier/plugins/html";
import prettier from "prettier/standalone";
import { useEffect, useState } from "react";

export function useFormattedCode(unformattedCode: string) {
	const [formattedCode, setFormattedCode] = useState<string>("");

	useEffect(() => {
		let isMounted = true;

		const format = async () => {
			try {
				const formatted = await prettier.format(unformattedCode, {
					parser: "babel",
					plugins: [babelPlugin, estreePlugin, htmlPlugin],
					printWidth: 80,
					tabWidth: 4,
					semi: true,
					singleQuote: false,
				});

				if (isMounted) {
					setFormattedCode(formatted);
				}
			} catch (error) {
				console.warn("Ошибка форматирования (возможно, синтаксическая ошибка в коде):", error);
				if (isMounted) {
					setFormattedCode(unformattedCode);
				}
			}
		};

		format();

		return () => {
			isMounted = false;
		};
	}, [unformattedCode]);

	return formattedCode;
}
