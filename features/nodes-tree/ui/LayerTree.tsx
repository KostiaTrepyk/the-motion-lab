"use client";

import { useLabStore } from "@/entities/node";
import { LayerTreeNode } from "./LayerTreeNode";
import { RootDropZone } from "./RootDropZone";

export function LayerTree() {
	const nodes = useLabStore((state) => state.nodes);

	return (
		<div className="flex flex-col flex-1 py-2 w-full h-full overflow-y-auto">
			<div className="mb-2 px-4 pb-2 border-neutral-800 border-b font-semibold text-neutral-500 text-xs uppercase tracking-wider shrink-0">
				Layers
			</div>

			{nodes.length === 0 ? (
				<div className="px-4 py-2 text-neutral-600 text-sm">Сцена пуста</div>
			) : (
				<>
					{nodes.map((node) => (
						<LayerTreeNode key={node.id} node={node} depth={1} />
					))}
					<RootDropZone />
				</>
			)}
		</div>
	);
}
