"use client";

import { useLabStore } from "@/entities/node";
import { Button } from "@/shared/ui";
import { handleAddNode } from "../lib/handleAddNode";

export function AddNodePanel() {
	// Получаем текущий выделенный элемент, чтобы знать, куда вкладывать новый
	const currentNodeId = useLabStore((state) => state.selectedNodeId);

	return (
		<div className="flex flex-wrap gap-2 p-2 border-neutral-800 border-b">
			<Button
				className="bg-neutral-800 hover:bg-neutral-700"
				size="small"
				onClick={() => handleAddNode("div", currentNodeId)}
			>
				+ Div
			</Button>
			<Button
				className="bg-teal-900/40 hover:bg-teal-900/60 border-teal-800 hover:border-teal-700 text-teal-400"
				variant="outline"
				size="small"
				onClick={() => handleAddNode("motion.div", currentNodeId)}
			>
				+ Motion Div
			</Button>
			<Button
				className="bg-purple-900/40 hover:bg-purple-900/60 border-purple-800 hover:border-purple-700 text-purple-400"
				variant="outline"
				size="small"
				onClick={() => handleAddNode("AnimatePresence", currentNodeId)}
			>
				+ AnimatePresence
			</Button>
			<Button
				className="bg-neutral-800 hover:bg-neutral-700"
				size="small"
				onClick={() => handleAddNode("text", currentNodeId)}
			>
				+ Text
			</Button>
		</div>
	);
}
