import { labStoreActions, useLabStore, type CanvasNode } from "@/entities/node";
import { useNodeDnD } from "../lib/useNodeDnD";
import { DropIndicator } from "./DropIndicator";
import { NestingLine } from "./NestingLine";
import { NodeRow } from "./NodeRow";

interface LayerTreeNodeProps {
	node: CanvasNode;
	depth: number; // Уровень вложенности для расчета отступа
	outdentIds?: string[];
}

export function LayerTreeNode({ node, depth, outdentIds }: LayerTreeNodeProps) {
	const selectedNodeId = useLabStore((state) => state.selectedNodeId);
	const isSelected = selectedNodeId === node.id;

	const { dropPosition, outdentLevel, dragProps } = useNodeDnD({ node, depth, outdentIds });

	const handleClick = (e: React.MouseEvent) => {
		e.stopPropagation();
		labStoreActions.changeSelectedNode(node.id);
	};

	// Строгое сужение типов (Type Narrowing), чтобы TS не ругался на отсутствие children у текста
	const children: CanvasNode[] = "children" in node && Array.isArray(node.children) ? node.children : [];

	return (
		<div className="relative">
			{dropPosition === "before" && <DropIndicator depth={depth} position="top" />}

			<NodeRow
				node={node}
				depth={depth}
				isSelected={isSelected}
				dropPosition={dropPosition}
				dragProps={dragProps}
				onClick={handleClick}
			/>

			{children.length > 0 && (
				<div className="group/list relative flex flex-col">
					<NestingLine depth={depth} />
					<div className="flex flex-col">
						{children.map((child, index) => {
							const isLast = index === children.length - 1;
							const nextOutdentIds = isLast ? [node.id, ...(outdentIds || [])] : [];
							return (
								<LayerTreeNode
									key={child.id}
									node={child}
									depth={depth + 1}
									outdentIds={nextOutdentIds}
								/>
							);
						})}
					</div>
				</div>
			)}

			{dropPosition === "after" && <DropIndicator depth={depth - (outdentLevel || 0)} position="bottom" />}
		</div>
	);
}
