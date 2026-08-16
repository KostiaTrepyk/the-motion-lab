import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import type { CanvasNode } from "../types/nodes";

export interface LabStoreState {
	nodes: CanvasNode[];
	selectedNodeId: string | null;
	past: CanvasNode[][];
	future: CanvasNode[][];
}

export const useLabStore = create<LabStoreState>()(
	immer(() => ({
		nodes: [],
		selectedNodeId: null,
		past: [],
		future: [],
	})),
);
