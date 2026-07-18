import { castDraft, type Draft } from "immer";
import type { MotionProps } from "motion/react";
import type { AnimatePresenceNode, CanvasNode, DivNode, MotionDivNode } from "../types/nodes";
import { isDescendantOf, findNodeInDraft } from "../lib/tree";
import { useLabStore } from "./store";

export const MOTION_OBJECT_KEYS: ReadonlyArray<keyof MotionProps> = [
	"initial",
	"animate",
	"exit",
	"transition",
	"whileHover",
	"whileTap",
	"whileFocus",
	"whileDrag",
	"whileInView",
] as const;

// Строгий тип полезной нагрузки для обновления пропсов
export type UpdatePropsPayload =
	| { type: "div"; props: Partial<DivNode["props"]> }
	| { type: "motion.div"; props: Partial<MotionDivNode["props"]> }
	| { type: "AnimatePresence"; props: Partial<AnimatePresenceNode["props"]> };

export type DropPosition = "before" | "after" | "inside";

export interface LabStoreActions {
	changeSelectedNode: (newSelectedNodeId: string | null) => void;
	addNode: (newNode: CanvasNode, parentId?: string | null) => void;
	removeNode: (nodeId: string) => void;
	updateNodeContent: (nodeId: string, content: string) => void;
	updateNodeProps: (nodeId: string, payload: UpdatePropsPayload) => void;
	moveNode: (activeId: string, overId: string, position: DropPosition) => void;
	toggleHidden: (nodeId: string) => void;
	toggleLocked: (nodeId: string) => void;
}

function changeSelectedNode(newSelectedNodeId: string | null): void {
	useLabStore.setState((state) => {
		state.selectedNodeId = newSelectedNodeId;
	});
}

function addNode(newNode: CanvasNode, parentId: string | null = null): void {
	useLabStore.setState((state) => {
		if (!parentId) {
			state.nodes.push(castDraft(newNode));
			return;
		}

		const parent = findNodeInDraft(state.nodes, parentId);

		if (parent && "children" in parent && Array.isArray(parent.children)) {
			parent.children.push(castDraft(newNode));
		} else {
			console.warn("Parent not found or cannot have children. Adding to root.");
			state.nodes.push(castDraft(newNode));
		}
	});
}

function removeNode(nodeId: string): void {
	useLabStore.setState((state) => {
		function findAndRemove(nodes: Draft<CanvasNode[]>): boolean {
			for (let i = 0; i < nodes.length; i++) {
				if (nodes[i].id === nodeId) {
					nodes.splice(i, 1);
					return true;
				}
				const node = nodes[i];
				if ("children" in node && Array.isArray(node.children)) {
					if (findAndRemove(node.children)) return true;
				}
			}
			return false;
		}

		findAndRemove(state.nodes);

		if (state.selectedNodeId === nodeId) {
			state.selectedNodeId = null;
		}
	});
}

function updateNodeContent(nodeId: string, content: string): void {
	useLabStore.setState((state) => {
		const node = findNodeInDraft(state.nodes, nodeId);
		if (node && node.type === "text") {
			node.content = content;
		}
	});
}

function updateNodeProps(nodeId: string, payload: UpdatePropsPayload): void {
	useLabStore.setState((state) => {
		const node = findNodeInDraft(state.nodes, nodeId);
		if (!node) return;

		if (node.type === "div" && payload.type === "div") {
			Object.assign(node.props, castDraft(payload.props));
		} else if (node.type === "AnimatePresence" && payload.type === "AnimatePresence") {
			Object.assign(node.props, castDraft(payload.props));
		} else if (node.type === "motion.div" && payload.type === "motion.div") {
			// Создаем поверхностную копию, чтобы можно было безопасно удалять ключи
			const remainingProps = { ...payload.props };

			// Сначала точечно обновляем motion-свойства
			MOTION_OBJECT_KEYS.forEach((key) => {
				// Если свойство есть в payload
				if (key in remainingProps) {
					const payloadValue = remainingProps[key];

					if (payloadValue !== undefined && typeof payloadValue === "object") {
						const existingValue = node.props[key];
						node.props[key] = {
							...(typeof existingValue === "object" ? existingValue : {}),
							...castDraft(payloadValue),
						};
					} else if (payloadValue !== undefined) {
						node.props[key] = castDraft(payloadValue);
					}

					// Удаляем обработанный ключ из копии
					delete remainingProps[key];
				}
			});

			// Теперь безопасно мержим оставшиеся (обычные) пропсы
			Object.assign(node.props, castDraft(remainingProps));
		}
	});
}

function moveNode(activeId: string, overId: string, position: DropPosition): void {
	useLabStore.setState((state) => {
		if (activeId === overId) return;

		// Проверка на перемещение родительского узла внутрь собственного потомка
		if (isDescendantOf(state.nodes as CanvasNode[], activeId, overId)) {
			console.warn("Cannot move a parent node into its own descendant.");
			return;
		}

		let draggedNode: CanvasNode | null = null;

		// 1. Находим и удаляем перетаскиваемый узел
		function removeDragged(nodes: Draft<CanvasNode[]>): boolean {
			for (let i = 0; i < nodes.length; i++) {
				if (nodes[i].id === activeId) {
					draggedNode = castDraft(nodes[i]) as CanvasNode;
					nodes.splice(i, 1);
					return true;
				}
				const node = nodes[i];
				if ("children" in node && Array.isArray(node.children)) {
					if (removeDragged(node.children)) return true;
				}
			}
			return false;
		}

		removeDragged(state.nodes);

		if (!draggedNode) return;

		// 2. Находим и вставляем узел на новое место относительно overId
		function insertDragged(nodes: Draft<CanvasNode[]>): boolean {
			for (let i = 0; i < nodes.length; i++) {
				if (nodes[i].id === overId) {
					const targetNode = nodes[i];

					if (position === "inside" && "children" in targetNode && Array.isArray(targetNode.children)) {
						targetNode.children.push(castDraft(draggedNode!));
					} else if (position === "before") {
						nodes.splice(i, 0, castDraft(draggedNode!));
					} else {
						// position === "after"
						nodes.splice(i + 1, 0, castDraft(draggedNode!));
					}
					return true;
				}
				const node = nodes[i];
				if ("children" in node && Array.isArray(node.children)) {
					if (insertDragged(node.children)) return true;
				}
			}
			return false;
		}

		insertDragged(state.nodes);
	});
}

function toggleHidden(nodeId: string): void {
	useLabStore.setState((state) => {
		const node = findNodeInDraft(state.nodes, nodeId);
		if (node) {
			node.hidden = !node.hidden;
		}
	});
}

function toggleLocked(nodeId: string): void {
	useLabStore.setState((state) => {
		const node = findNodeInDraft(state.nodes, nodeId);
		if (node) {
			const newLockedState = !node.locked;
			
			function setLockedRecursive(n: CanvasNode, locked: boolean) {
				n.locked = locked;
				if ("children" in n && Array.isArray(n.children)) {
					n.children.forEach((child) => setLockedRecursive(child as CanvasNode, locked));
				}
			}

			setLockedRecursive(node as CanvasNode, newLockedState);
		}
	});
}

export const labStoreActions: LabStoreActions = {
	changeSelectedNode,
	addNode,
	removeNode,
	updateNodeContent,
	updateNodeProps,
	moveNode,
	toggleHidden,
	toggleLocked,
};
