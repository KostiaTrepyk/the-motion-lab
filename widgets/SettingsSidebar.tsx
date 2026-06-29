"use client";

import type { CanvasNode } from "@/features/lab";
import { useLabStore } from "@/features/lab";
import { twMerge } from "tailwind-merge";

function findSelectedNode(nodes: CanvasNode[], id: string): CanvasNode | null {
	for (const node of nodes) {
		if (node.id === id) return node;
		if ("children" in node) {
			const found = findSelectedNode(node.children, id);
			if (found) return found;
		}
	}
	return null;
}

export function SettingsSidebar({ ...rest }: React.HTMLAttributes<HTMLDivElement>) {
	const selectedNodeId = useLabStore((s) => s.selectedNodeId);
	const nodes = useLabStore((s) => s.nodes);

	const selectedNode = selectedNodeId ? findSelectedNode(nodes, selectedNodeId) : null;

	return (
		<div {...rest} className={twMerge(rest.className, "p-4 overflow-y-auto flex flex-col gap-4")}>
			<div className="font-bold text-neutral-400 text-xl text-center uppercase">Properties</div>

			{!selectedNode ? (
				<div className="mt-10 text-neutral-600 text-sm text-center">Элемент не выбран</div>
			) : (
				<div className="flex flex-col gap-4">
					<div className="pb-2 border-neutral-800 border-b text-teal-400 text-sm">
						Type: {selectedNode.type}
					</div>

					{/* Пример: Если это текстовая нода */}
					{selectedNode.type === "text" && (
						<div className="flex flex-col gap-2">
							<label className="text-neutral-400 text-xs">Content</label>
							<input
								className="bg-neutral-900 p-2 border border-neutral-700 rounded text-white text-sm"
								value={selectedNode.content}
								onChange={(e) => {
									// TODO: Добавить экшен labStoreActions.updateNodeContent(selectedNode.id, e.target.value)
								}}
							/>
						</div>
					)}

					{/* Пример: Если это div или motion.div */}
					{(selectedNode.type === "div" || selectedNode.type === "motion.div") && (
						<div className="flex flex-col gap-2">
							<label className="text-neutral-400 text-xs">Classes (Tailwind)</label>
							<textarea
								className="bg-neutral-900 p-2 border border-neutral-700 rounded min-h-[80px] text-white text-sm"
								value={selectedNode.props.className || ""}
								onChange={(e) => {
									// TODO: Добавить экшен labStoreActions.updateNodeProps(selectedNode.id, { className: e.target.value })
								}}
							/>
						</div>
					)}
				</div>
			)}
		</div>
	);
}
