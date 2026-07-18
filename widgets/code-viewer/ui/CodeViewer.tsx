"use client";

import { useLabStore } from "@/entities/node";
import { generateCodeFromNodes, useFormattedCode } from "@/features/preview";
import { IconButton } from "@/shared/ui";
import { Suspense, useState } from "react";
import { FiCheck, FiCopy } from "react-icons/fi";

export function CodeViewer({ ...rest }: React.HTMLAttributes<HTMLDivElement>) {
	const nodes = useLabStore((s) => s.nodes);
	const rawCode = generateCodeFromNodes(nodes);
	const formattedCode = useFormattedCode(rawCode);
	const [copied, setCopied] = useState(false);

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
				className="top-4 right-4 z-10 absolute"
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
