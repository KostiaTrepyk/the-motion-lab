"use client";

import { labStoreActions, useLabStore } from "@/entities/node";
import { useState } from "react";
import { NESTING_LINE_OFFSET_PX } from "../lib/constants";

export function RootDropZone() {
	const nodes = useLabStore((state) => state.nodes);
	const [isOver, setIsOver] = useState(false);

	const handleDragOver = (e: React.DragEvent) => {
		e.preventDefault();
		e.stopPropagation();
		setIsOver(true);
	};

	const handleDragLeave = () => {
		setIsOver(false);
	};

	const handleDrop = (e: React.DragEvent) => {
		e.preventDefault();
		e.stopPropagation();
		setIsOver(false);

		const activeId = e.dataTransfer.getData("text/plain");
		if (!activeId) return;

		if (nodes.length > 0) {
			const lastNode = nodes[nodes.length - 1];
			if (activeId !== lastNode.id) {
				labStoreActions.moveNode(activeId, lastNode.id, "after");
			}
		}
	};

	return (
		<div
			onDragOver={handleDragOver}
			onDragLeave={handleDragLeave}
			onDrop={handleDrop}
			className={`flex-1 min-h-[60px] relative transition-colors ${isOver ? "bg-teal-900/10" : ""}`}
		>
			{isOver && (
				<div
					style={{ marginLeft: `${NESTING_LINE_OFFSET_PX}px` }}
					className="top-0 right-0 z-10 absolute bg-teal-500 h-[2px] pointer-events-none"
				/>
			)}
		</div>
	);
}
