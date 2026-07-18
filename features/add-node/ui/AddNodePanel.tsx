"use client";

import { labStoreActions, useLabStore, type CanvasNode, type ElementType } from "@/entities/node";
import { generateUniqueId } from "@/shared/lib";
import { Button } from "@/shared/ui";

export function AddNodePanel() {
	// Получаем текущий выделенный элемент, чтобы знать, куда вкладывать новый
	const currentNodeId = useLabStore((state) => state.selectedNodeId);

	const handleAddNode = (type: ElementType) => {
		const id = generateUniqueId();
		let newNode: CanvasNode;

		// Фабрика узлов в зависимости от типа
		switch (type) {
			case "div":
				newNode = {
					id,
					name: "Div",
					type: "div",
					props: { className: "p-4 bg-neutral-800 rounded-md min-h-[50px] min-w-[50px]" },
					children: [],
				};
				break;

			case "motion.div":
				newNode = {
					id,
					name: "Motion Div",
					type: "motion.div",
					props: {
						className: "p-4 bg-teal-600 rounded-md min-h-[50px] min-w-[50px]",
						initial: { opacity: 0, scale: 0.8 },
						animate: { opacity: 1, scale: 1 },
					},
					children: [],
				};
				break;

			case "AnimatePresence":
				newNode = {
					id,
					name: "Animate Presence",
					type: "AnimatePresence",
					props: { mode: "wait" },
					children: [],
				};
				break;

			case "text":
				newNode = {
					id,
					name: "Text",
					type: "text",
					content: "Новый текст",
				};
				break;

			default:
				const _exhaustiveCheck: never = type;
				console.warn(`Unsupported node type: ${_exhaustiveCheck}`);
				return;
		}

		labStoreActions.addNode(newNode, currentNodeId);
	};

	return (
		<div className="flex flex-wrap gap-2 p-2 border-neutral-800 border-b">
			<Button className="bg-neutral-800 hover:bg-neutral-700" size="small" onClick={() => handleAddNode("div")}>
				+ Div
			</Button>
			<Button
				className="bg-teal-900/40 hover:bg-teal-900/60 border-teal-800 hover:border-teal-700 text-teal-400"
				variant="outline"
				size="small"
				onClick={() => handleAddNode("motion.div")}
			>
				+ Motion Div
			</Button>
			<Button
				className="bg-purple-900/40 hover:bg-purple-900/60 border-purple-800 hover:border-purple-700 text-purple-400"
				variant="outline"
				size="small"
				onClick={() => handleAddNode("AnimatePresence")}
			>
				+ AnimatePresence
			</Button>
			<Button className="bg-neutral-800 hover:bg-neutral-700" size="small" onClick={() => handleAddNode("text")}>
				+ Text
			</Button>
		</div>
	);
}
