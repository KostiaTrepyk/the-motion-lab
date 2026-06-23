"use client";

import { labStoreActions, useLabStore } from "../model/store"; // Поправь пути под свой FSD

import type { CanvasNode } from "../model/types/nodes";

interface LayerTreeNodeProps {
	node: CanvasNode;
	depth: number; // Уровень вложенности для расчета отступа
}

function LayerTreeNode({ node, depth }: LayerTreeNodeProps) {
	const selectedNodeId = useLabStore((state) => state.selectedNodeId);
	const isSelected = selectedNodeId === node.id;

	const handleClick = (e: React.MouseEvent) => {
		e.stopPropagation();
		labStoreActions.changeSelectedNode(node.id);
	};

	// Строгое сужение типов (Type Narrowing), чтобы TS не ругался на отсутствие children у текста
	const children: CanvasNode[] = "children" in node && Array.isArray(node.children) ? node.children : [];

	return (
		<div>
			{/* Сама строка элемента */}
			<div
				onClick={handleClick}
				style={{ paddingLeft: `${depth * 12}px` }}
				className={`
                    flex items-center py-1.5 px-3 cursor-pointer select-none text-sm border-l-2
                    hover:bg-neutral-800 transition-colors
                    ${
						isSelected
							? "bg-teal-900/20 border-teal-500 text-teal-400"
							: "border-transparent text-neutral-300"
					}
                `}
			>
				{/* Примитивная индикация типа узла */}
				<span className="inline-block opacity-50 mr-2 w-4 text-xs text-center">
					{node.type === "text" ? "T" : "❖"}
				</span>
				<span className="truncate">{node.name || node.type}</span>
			</div>

			{/* Рекурсивный рендер дочерних элементов */}
			{children.length > 0 && (
				<div className="flex flex-col">
					{children.map((child) => (
						<LayerTreeNode key={child.id} node={child} depth={depth + 1} />
					))}
				</div>
			)}
		</div>
	);
}

export function LayerTree() {
	const nodes = useLabStore((state) => state.nodes);

	return (
		<div className="flex flex-col py-2 border-neutral-800 border-r w-full h-full overflow-y-auto">
			<div className="mb-2 px-4 pb-2 border-neutral-800 border-b font-semibold text-neutral-500 text-xs uppercase tracking-wider">
				Layers
			</div>

			{nodes.length === 0 ? (
				<div className="px-4 py-2 text-neutral-600 text-sm">Сцена пуста</div>
			) : (
				nodes.map((node) => <LayerTreeNode key={node.id} node={node} depth={1} />)
			)}
		</div>
	);
}
