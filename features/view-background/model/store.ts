import { create } from "zustand";

export type ViewBackground = "dark" | "light" | "grid";

export interface ViewState {
	viewBackground: ViewBackground;
	setViewBackground: (bg: ViewBackground) => void;
}

export const useViewStore = create<ViewState>((set) => ({
	viewBackground: "dark",
	setViewBackground: (bg: ViewBackground) => set({ viewBackground: bg }),
}));
