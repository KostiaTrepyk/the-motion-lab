"use client";

import type { CanvasNode } from "@/entities/node";
import { useLabStore } from "@/entities/node";
import { DivSettings, MotionDivSettings, TextSettings } from "@/features/edit-node";
import { Sidebar, Typography } from "@/shared/ui";

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

export function SettingsSidebar({ ...attrs }: React.HTMLAttributes<HTMLDivElement>) {
	const selectedNodeId = useLabStore((s) => s.selectedNodeId);
	const nodes = useLabStore((s) => s.nodes);

	const selectedNode = selectedNodeId ? findSelectedNode(nodes, selectedNodeId) : null;

	return (
		<Sidebar title="Properties" {...attrs}>
			{!selectedNode ? (
				<Typography type="body" className="mt-10 text-neutral-600 text-center">
					Элемент не выбран
				</Typography>
			) : (
				<div className="flex flex-col divide-y divide-neutral-800/50">
					<div className="pb-4">
						<Typography type="mono" className="text-teal-400">
							Type: {selectedNode.type}
						</Typography>
					</div>

					{selectedNode.type === "text" && <TextSettings node={selectedNode} />}
					{selectedNode.type === "div" && <DivSettings node={selectedNode} />}
					{selectedNode.type === "motion.div" && <MotionDivSettings node={selectedNode} />}
				</div>
			)}
		</Sidebar>
	);
}
