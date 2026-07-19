import { create } from "zustand";

interface DnDStore {
	draggedNodeId: string | null;
	setDraggedNodeId: (id: string | null) => void;
}

export const useDnDStore = create<DnDStore>((set) => ({
	draggedNodeId: null,
	setDraggedNodeId: (id) => set({ draggedNodeId: id }),
}));
