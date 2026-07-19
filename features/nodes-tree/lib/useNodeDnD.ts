import { labStoreActions, type CanvasNode, type DropPosition } from "@/entities/node";
import { useState } from "react";
import { useDnDStore } from "../model/dnd-store";
import { INDENT_STEP_PX } from "./constants";

interface UseNodeDnDProps {
	node: CanvasNode;
	depth: number;
	outdentIds?: string[];
}

function createDragImageElem(node: CanvasNode) {
	// Создаем аккуратный drag image, чтобы он не перекрывал интерфейс
	const dragGhost = document.createElement("div");
	dragGhost.textContent = node.name || node.type;
	dragGhost.style.position = "absolute";
	dragGhost.style.top = "-1000px";
	dragGhost.style.background = "#115e59"; // teal-900
	dragGhost.style.color = "#2dd4bf"; // teal-400
	dragGhost.style.border = "1px solid #14b8a6"; // teal-500
	dragGhost.style.padding = "4px 8px";
	dragGhost.style.borderRadius = "6px";
	dragGhost.style.fontSize = "12px";
	dragGhost.style.fontWeight = "500";
	dragGhost.style.pointerEvents = "none";
	dragGhost.style.boxShadow = "0 4px 6px -1px rgba(0, 0, 0, 0.5)";
	return dragGhost;
}

export function useNodeDnD({ node, depth, outdentIds }: UseNodeDnDProps) {
	const [dropPosition, setDropPosition] = useState<DropPosition | null>(null);
	const [outdentLevel, setOutdentLevel] = useState<number>(0);

	const handleDragStart = (e: React.DragEvent) => {
		e.stopPropagation();
		e.dataTransfer.setData("text/plain", node.id);
		e.dataTransfer.effectAllowed = "move";
		useDnDStore.getState().setDraggedNodeId(node.id);

		const dragGhost = createDragImageElem(node);

		document.body.appendChild(dragGhost);
		// Смещаем картинку чуть вправо-вниз от курсора, чтобы курсор был точно над индикатором
		e.dataTransfer.setDragImage(dragGhost, -12, -10);

		setTimeout(() => {
			if (dragGhost.parentNode) {
				dragGhost.parentNode.removeChild(dragGhost);
			}
		}, 100);
	};

	const handleDragOver = (e: React.DragEvent) => {
		e.preventDefault();
		e.stopPropagation();

		if (useDnDStore.getState().draggedNodeId === node.id) {
			setDropPosition(null);
			setOutdentLevel(0);
			return;
		}

		const rect = e.currentTarget.getBoundingClientRect();
		const relativeY = e.clientY - rect.top;
		const relativeX = e.clientX - rect.left;
		const height = rect.height;

		const canHaveChildren = node.type !== "text";
		const hasChildren = "children" in node && Array.isArray(node.children) && node.children.length > 0;

		let newDropPosition: DropPosition | null = null;

		if (canHaveChildren) {
			if (relativeY < height * 0.25) {
				newDropPosition = "before";
			} else if (relativeY > height * 0.75 && !hasChildren) {
				newDropPosition = "after";
			} else {
				newDropPosition = "inside";
			}
		} else {
			if (relativeY < height * 0.5) {
				newDropPosition = "before";
			} else {
				newDropPosition = "after";
			}
		}

		let newOutdentLevel = 0;
		if (newDropPosition === "after" && outdentIds && outdentIds.length > 0) {
			const maxOutdent = outdentIds.length;
			const rawOutdent = depth - Math.round(relativeX / INDENT_STEP_PX);
			newOutdentLevel = Math.max(0, Math.min(rawOutdent, maxOutdent));
		}

		setDropPosition(newDropPosition);
		setOutdentLevel(newOutdentLevel);
	};

	const handleDragLeave = () => {
		setDropPosition(null);
		setOutdentLevel(0);
	};

	const handleDrop = (e: React.DragEvent) => {
		e.preventDefault();
		e.stopPropagation();
		setDropPosition(null);
		setOutdentLevel(0);

		const activeId = e.dataTransfer.getData("text/plain");
		if (!activeId || activeId === node.id) return;

		if (dropPosition) {
			let finalOverId = node.id;
			if (dropPosition === "after" && outdentLevel > 0 && outdentIds) {
				finalOverId = outdentIds[outdentLevel - 1];
			}
			labStoreActions.moveNode(activeId, finalOverId, dropPosition);
		}
	};

	const handleDragEnd = () => {
		useDnDStore.getState().setDraggedNodeId(null);
	};

	return {
		dropPosition,
		outdentLevel,
		dragProps: {
			draggable: !node.locked,
			onDragStart: handleDragStart,
			onDragOver: handleDragOver,
			onDragLeave: handleDragLeave,
			onDrop: handleDrop,
			onDragEnd: handleDragEnd,
		},
	};
}
