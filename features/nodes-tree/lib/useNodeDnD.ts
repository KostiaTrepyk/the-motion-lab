import { useState } from "react";
import { labStoreActions, type CanvasNode, type DropPosition } from "@/entities/node";

interface UseNodeDnDProps {
	node: CanvasNode;
}

export function useNodeDnD({ node }: UseNodeDnDProps) {
	const [dropPosition, setDropPosition] = useState<DropPosition | null>(null);

	const handleDragStart = (e: React.DragEvent) => {
		e.stopPropagation();
		e.dataTransfer.setData("text/plain", node.id);
		e.dataTransfer.effectAllowed = "move";
	};

	const handleDragOver = (e: React.DragEvent) => {
		e.preventDefault();
		e.stopPropagation();

		const rect = e.currentTarget.getBoundingClientRect();
		const relativeY = e.clientY - rect.top;
		const height = rect.height;

		const canHaveChildren = node.type !== "text";

		if (canHaveChildren) {
			if (relativeY < height * 0.25) {
				setDropPosition("before");
			} else if (relativeY > height * 0.75) {
				setDropPosition("after");
			} else {
				setDropPosition("inside");
			}
		} else {
			if (relativeY < height * 0.5) {
				setDropPosition("before");
			} else {
				setDropPosition("after");
			}
		}
	};

	const handleDragLeave = () => {
		setDropPosition(null);
	};

	const handleDrop = (e: React.DragEvent) => {
		e.preventDefault();
		e.stopPropagation();
		setDropPosition(null);

		const activeId = e.dataTransfer.getData("text/plain");
		if (!activeId || activeId === node.id) return;

		if (dropPosition) {
			labStoreActions.moveNode(activeId, node.id, dropPosition);
		}
	};

	return {
		dropPosition,
		dragProps: {
			draggable: !node.locked,
			onDragStart: handleDragStart,
			onDragOver: handleDragOver,
			onDragLeave: handleDragLeave,
			onDrop: handleDrop,
		},
	};
}
