import type { Draft } from "immer";
import type { CanvasNode } from "../types/nodes";

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

export function isDescendantOf(nodes: CanvasNode[], parentId: string, childId: string): boolean {
	const parentNode = findNodeById(nodes, parentId);
	if (!parentNode) return false;

	function search(node: CanvasNode): boolean {
		if ("children" in node && Array.isArray(node.children)) {
			for (const child of node.children) {
				if (child.id === childId) return true;
				if (search(child)) return true;
			}
		}
		return false;
	}

	return search(parentNode);
}

export function findNodeInDraft(nodes: Draft<CanvasNode[]>, id: string): Draft<CanvasNode> | undefined {
	for (const node of nodes) {
		if (node.id === id) return node;
		if ("children" in node && Array.isArray(node.children)) {
			const found = findNodeInDraft(node.children, id);
			if (found) return found;
		}
	}
	return undefined;
}
