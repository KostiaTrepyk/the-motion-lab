"use client";

import { labStoreActions, useLabStore, type CanvasNode } from "@/entities/node";
import { FiEye, FiEyeOff, FiLock, FiUnlock } from "react-icons/fi";
import { useNodeDnD } from "../lib/useNodeDnD";

interface LayerTreeNodeProps {
	node: CanvasNode;
	depth: number; // Уровень вложенности для расчета отступа
}

function LayerTreeNode({ node, depth }: LayerTreeNodeProps) {
	const selectedNodeId = useLabStore((state) => state.selectedNodeId);
	const isSelected = selectedNodeId === node.id;
	
	const { dropPosition, dragProps } = useNodeDnD({ node });

	const handleClick = (e: React.MouseEvent) => {
		e.stopPropagation();
		labStoreActions.changeSelectedNode(node.id);
	};

	// Строгое сужение типов (Type Narrowing), чтобы TS не ругался на отсутствие children у текста
	const children: CanvasNode[] = "children" in node && Array.isArray(node.children) ? node.children : [];

	return (
		<div className="relative">
			{/* Верхний индикатор (вставка перед узлом) */}
			{dropPosition === "before" && (
				<div
					style={{ marginLeft: `${depth * 12}px` }}
					className="absolute top-0 left-0 right-0 h-[2px] bg-teal-500 z-10 pointer-events-none"
				/>
			)}

			{/* Сама строка элемента */}
			<div
				{...dragProps}
				onClick={handleClick}
				style={{ paddingLeft: `${depth * 12}px` }}
				className={`
                    group flex items-center py-1.5 px-3 cursor-pointer select-none text-sm border-l-2
                    hover:bg-neutral-800 transition-colors relative
					${
						isSelected
							? "bg-teal-900/20 border-teal-500 text-teal-400"
							: "border-transparent text-neutral-300"
					}
					${node.hidden ? "opacity-50" : "opacity-100"}
					${
						dropPosition === "inside"
							? "bg-teal-900/40 border-teal-400"
							: ""
					}
                `}
			>
				{/* Примитивная индикация типа узла */}
				<span className="inline-block opacity-50 mr-2 w-4 text-xs text-center">
					{node.type === "text" ? "T" : "❖"}
				</span>
				<span className="truncate">{node.name || node.type}</span>

				{/* Действия (при наведении) */}
				<div
					className={`ml-auto flex items-center gap-1.5 transition-opacity ${
						node.hidden || node.locked ? "opacity-100" : "opacity-0 group-hover:opacity-100"
					}`}
				>
					<button
						className={`p-0.5 rounded transition-colors ${
							node.locked ? "text-amber-500 hover:text-amber-400" : "text-neutral-500 hover:text-neutral-300"
						}`}
						title={node.locked ? "Unlock" : "Lock"}
						onClick={(e) => {
							e.stopPropagation();
							labStoreActions.toggleLocked(node.id);
						}}
					>
						{node.locked ? <FiLock className="w-3.5 h-3.5" /> : <FiUnlock className="w-3.5 h-3.5" />}
					</button>
					<button
						className={`p-0.5 rounded transition-colors ${
							node.hidden ? "text-amber-500 hover:text-amber-400" : "text-neutral-500 hover:text-neutral-300"
						}`}
						title={node.hidden ? "Show" : "Hide"}
						onClick={(e) => {
							e.stopPropagation();
							labStoreActions.toggleHidden(node.id);
						}}
					>
						{node.hidden ? <FiEyeOff className="w-3.5 h-3.5" /> : <FiEye className="w-3.5 h-3.5" />}
					</button>
				</div>
			</div>

			{/* Нижний индикатор (вставка после узла и всех его детей) */}
			{dropPosition === "after" && (
				<div
					style={{ marginLeft: `${depth * 12}px` }}
					className="absolute bottom-0 left-0 right-0 h-[2px] bg-teal-500 z-10 pointer-events-none"
				/>
			)}

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
		<div className="flex flex-col py-2 w-full overflow-y-auto">
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
