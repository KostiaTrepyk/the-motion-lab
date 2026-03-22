import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { createLabSlice, LabSliceState } from "./slices/lab/labSlice";

// Общий тип всего стора
export type SharedState = LabSliceState;

export const useAppStore = create<SharedState>()(
	immer((...a) => ({
		...createLabSlice(...a),
	})),
);
