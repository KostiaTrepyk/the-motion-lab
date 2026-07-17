"use client";

import type { CanvasNode } from "@/entities/node";
import { useLabStore } from "@/entities/node";
import { DivSettings, MotionDivSettings, TextSettings } from "@/features/nodes/edit-node";
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
						Type: <span className="font-mono">{selectedNode.type}</span>
					</div>

					{selectedNode.type === "text" && <TextSettings node={selectedNode} />}
					{selectedNode.type === "div" && <DivSettings node={selectedNode} />}
					{selectedNode.type === "motion.div" && <MotionDivSettings node={selectedNode} />}
				</div>
			)}
		</div>
	);
}
