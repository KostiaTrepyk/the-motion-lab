"use client";

import { generateCodeFromModules, useLabStore } from "@/features/lab";
import * as babelPlugin from "prettier/plugins/babel";
import * as estreePlugin from "prettier/plugins/estree";
import * as htmlPlugin from "prettier/plugins/html";
import prettier from "prettier/standalone";
import { Suspense, useEffect, useState } from "react";

export function CodeViewer({ ...rest }: React.HTMLAttributes<HTMLDivElement>) {
	const modules = useLabStore((s) => s.nodes);
	const [formattedCode, setFormattedCode] = useState<string>("");

	const format = async (unformattedCode: string) => {
		try {
			const formatted = await prettier.format(unformattedCode, {
				parser: "babel",
				plugins: [babelPlugin, estreePlugin, htmlPlugin],
				printWidth: 80,
				tabWidth: 4,
				semi: true,
				singleQuote: false,
			});
			return formatted;
		} catch (error) {
			console.warn("Ошибка форматирования (возможно, синтаксическая ошибка в коде):", error);
			// Если код сломан, возвращаем как было, чтобы не стереть текст пользователя
			return unformattedCode;
		}
	};

	useEffect(() => {
		format(generateCodeFromModules(modules)).then(setFormattedCode);
	}, [modules]);

	return (
		<div {...rest}>
			<div className="border-neutral-900 border-t"></div>
			<Suspense fallback={<div className="p-4">Загрузка...</div>}>
				<textarea
					className="p-4 outline-0 w-full h-20dvh"
					defaultValue={formattedCode}
					onChange={() => console.error("Not implemented!")}
				></textarea>
			</Suspense>
		</div>
	);
}
