"use client";

import { useLabStore } from "@/entities/node";
import { Button } from "@/shared/ui";
import { handleAddNode } from "../lib/handleAddNode";

export function AddNodePanel() {
	// Получаем текущий выделенный элемент, чтобы знать, куда вкладывать новый
	const currentNodeId = useLabStore((state) => state.selectedNodeId);

	return (
		<div className="flex flex-wrap gap-2 p-2 border-neutral-800 border-b">
			<Button variant="soft" color="secondary" size="small" onClick={() => handleAddNode("text", currentNodeId)}>
				+ Text
			</Button>
			<Button variant="soft" size="small" onClick={() => handleAddNode("div", currentNodeId)} color="secondary">
				+ Div
			</Button>
			<Button variant="soft" color="teal" size="small" onClick={() => handleAddNode("motion.div", currentNodeId)}>
				+ Motion Div
			</Button>
			<Button
				variant="soft"
				color="purple"
				size="small"
				onClick={() => handleAddNode("AnimatePresence", currentNodeId)}
			>
				+ AnimatePresence
			</Button>
		</div>
	);
}
