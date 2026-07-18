"use client";

import { useLabStore } from "@/entities/node";
import { generateCodeFromNodes } from "@/features/preview";
import { IconButton } from "@/shared/ui";
import * as babelPlugin from "prettier/plugins/babel";
import * as estreePlugin from "prettier/plugins/estree";
import * as htmlPlugin from "prettier/plugins/html";
import prettier from "prettier/standalone";
import { Suspense, useEffect, useState } from "react";
import { FiCheck, FiCopy } from "react-icons/fi";

export function CodeViewer({ ...rest }: React.HTMLAttributes<HTMLDivElement>) {
	const nodes = useLabStore((s) => s.nodes);
	const [formattedCode, setFormattedCode] = useState<string>("");
	const [copied, setCopied] = useState(false);

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
		format(generateCodeFromNodes(nodes)).then(setFormattedCode);
	}, [nodes]);

	const handleCopy = () => {
		navigator.clipboard.writeText(formattedCode);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	return (
		<div {...rest} className={`relative ${rest.className || ""}`}>
			<div className="border-neutral-900 border-t"></div>
			<IconButton
				color="ghost"
				variant="ghost"
				onClick={handleCopy}
				title="Copy to clipboard"
				className="absolute top-4 right-4 z-10"
			>
				{copied ? <FiCheck className="text-green-500" /> : <FiCopy />}
			</IconButton>
			<Suspense fallback={<div className="p-4">Загрузка...</div>}>
				<textarea
					className="p-4 pt-6 outline-0 w-full h-20dvh"
					defaultValue={formattedCode}
					readOnly
				></textarea>
			</Suspense>
		</div>
	);
}
