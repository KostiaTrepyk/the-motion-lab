"use client";

import { useLabStore } from "@/entities/node";
import { useEffect, type JSX } from "react";
import { NodeRenderer } from "./NodeRenderer";

export function GenerateElement(): JSX.Element {
	const nodes = useLabStore((s) => s.nodes);

	useEffect(() => {
		// Проверяем, не подгрузили ли мы его уже ранее
		if (document.getElementById("tailwind-cdn") === null) {
			const script = document.createElement("script");
			script.id = "tailwind-cdn";
			script.src = "https://cdn.jsdelivr.net/npm/@unocss/runtime";
			script.async = true; // чтобы не тормозить UI

			document.head.appendChild(script);
		}
	}, []);

	return <NodeRenderer nodes={nodes} />;
}
