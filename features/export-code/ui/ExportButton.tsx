"use client";

import { useLabStore } from "@/entities/node";
import { Button, IconButton } from "@/shared/ui";
import { useRef, useState } from "react";
import { FiCopy, FiDownload } from "react-icons/fi";
import { twMerge } from "tailwind-merge";
import { downloadFile, formatCode } from "../lib";

export function ExportButton() {
	const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);
	const exportMenuRef = useRef<HTMLDivElement>(null);
	const nodes = useLabStore((s) => s.nodes);

	async function handleExportText() {
		const code = await formatCode(nodes);
		await navigator.clipboard.writeText(code);
		alert("Код скопирован в буфер обмена!");
	}

	async function handleExportTsx() {
		const code = await formatCode(nodes);
		downloadFile(code, "Component.tsx");
	}

	return (
		<div
			className="relative flex gap-2"
			ref={exportMenuRef}
			onMouseEnter={() => setIsExportMenuOpen(true)}
			onMouseLeave={() => setIsExportMenuOpen(false)}
		>
			<IconButton className="group" title="Экспорт" variant="ghost" color="secondary">
				<FiDownload className="w-full h-full active:scale-95 transition-transform" />
			</IconButton>

			<div
				className={twMerge(
					"top-full right-0 z-10 absolute pt-2 transition-all duration-300",
					isExportMenuOpen ? "opacity-100 visible translate-y-0" : "opacity-0 invisible translate-y-2",
				)}
			>
				<div className="flex flex-col gap-1 bg-neutral-900 shadow-xl p-1 border border-neutral-700/50 rounded-xl w-56 overflow-hidden">
					<Button
						variant="ghost"
						color="secondary"
						size="small"
						icon={<FiCopy className="w-4 h-4" />}
						className="justify-start px-3 py-2.5 w-full font-medium"
						onClick={() => {
							handleExportText();
							setIsExportMenuOpen(false);
						}}
					>
						Скопировать текст
					</Button>
					<Button
						variant="ghost"
						color="secondary"
						size="small"
						icon={<FiDownload className="w-4 h-4" />}
						className="justify-start px-3 py-2.5 w-full font-medium"
						onClick={() => {
							handleExportTsx();
							setIsExportMenuOpen(false);
						}}
					>
						Скачать .tsx
					</Button>
				</div>
			</div>
		</div>
	);
}
