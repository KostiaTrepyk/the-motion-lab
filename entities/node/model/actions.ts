import { castDraft, type Draft } from "immer";
import type { AnimatePresenceNode, CanvasNode, DivNode, MotionDivNode } from "../types/nodes";
import { useLabStore } from "./store";

// Строгий тип полезной нагрузки для обновления пропсов
export type UpdatePropsPayload =
	| { type: "div"; props: Partial<DivNode["props"]> }
	| { type: "motion.div"; props: Partial<MotionDivNode["props"]> }
	| { type: "AnimatePresence"; props: Partial<AnimatePresenceNode["props"]> };

export interface LabStoreActions {
	changeSelectedNode: (newSelectedNodeId: string | null) => void;
	addNode: (newNode: CanvasNode, parentId?: string | null) => void;
	removeNode: (nodeId: string) => void;
	updateNodeContent: (nodeId: string, content: string) => void;
	updateNodeProps: (nodeId: string, payload: UpdatePropsPayload) => void;
}

export function findNodeById(nodes: CanvasNode[], nodeId: string): CanvasNode | undefined {
	for (const node of nodes) {
		if (node.id === nodeId) return node;
		if ("children" in node && Array.isArray(node.children)) {
			const found = findNodeById(node.children, nodeId);
			if (found) return found;
		}
	}
	return undefined;
}

function findNodeInDraft(nodes: Draft<CanvasNode[]>, id: string): Draft<CanvasNode> | undefined {
	for (const node of nodes) {
		if (node.id === id) return node;
		if ("children" in node && Array.isArray(node.children)) {
			const found = findNodeInDraft(node.children, id);
			if (found) return found;
		}
	}
	return undefined;
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

		// Строгий Type Narrowing
		if (node.type === "div" && payload.type === "div") {
			node.props = { ...node.props, ...castDraft(payload.props) };
		} else if (node.type === "motion.div" && payload.type === "motion.div") {
			node.props = { ...node.props, ...castDraft(payload.props) };
		} else if (node.type === "AnimatePresence" && payload.type === "AnimatePresence") {
			node.props = { ...node.props, ...castDraft(payload.props) };
		}
	});
}

export const labStoreActions: LabStoreActions = {
	changeSelectedNode,
	addNode,
	removeNode,
	updateNodeContent,
	updateNodeProps,
};
