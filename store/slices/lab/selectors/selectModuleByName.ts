import { Module, ModuleName } from "@/types/modules";
import { LabSliceState } from "../labSlice";

export const selectModuleByName =
	(moduleName: ModuleName) =>
	(state: LabSliceState): Module | undefined => {
		return state.modules.find((m) => m.name === moduleName);
	};
