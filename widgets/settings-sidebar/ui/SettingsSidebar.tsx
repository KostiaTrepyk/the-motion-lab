"use client";

import type { CanvasNode } from "@/entities/node";
import { useLabStore } from "@/entities/node";
import { DivSettings, MotionDivSettings, TextSettings } from "@/features/edit-node";
import { Sidebar, Typography } from "@/shared/ui";
import React from "react";

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
				<div className="flex flex-col justify-center items-center px-4 py-16 text-center">
					<div className="flex justify-center items-center bg-neutral-900 mb-3 border border-neutral-800 rounded-full w-12 h-12 text-neutral-500">
						<span>⚙️</span>
					</div>
					<Typography type="body" className="font-medium text-neutral-400">
						Элемент не выбран
					</Typography>
					<Typography type="mono" className="mt-1 text-neutral-600 text-xs">
						Выберите элемент на холсте или в слоях для настройки
					</Typography>
				</div>
			) : (
				<div className="flex flex-col gap-3">
					{/* Selected Element Header Badge */}
					<div className="flex justify-between items-center bg-neutral-900/90 px-3 py-2 border border-neutral-800/80 rounded-lg">
						<span className="font-medium text-neutral-400 text-xs">Выбранный элемент:</span>
						<span className="bg-amber-500/10 px-2 py-0.5 border border-amber-500/20 rounded font-mono font-semibold text-amber-400 text-xs">
							{selectedNode.name || selectedNode.type}
						</span>
					</div>

					{/* Property Accordion Sections */}
					<div className="flex flex-col">
						{selectedNode.type === "text" && <TextSettings node={selectedNode} />}
						{selectedNode.type === "div" && <DivSettings node={selectedNode} />}
						{selectedNode.type === "motion.div" && <MotionDivSettings node={selectedNode} />}
					</div>
				</div>
			)}
		</Sidebar>
	);
}
