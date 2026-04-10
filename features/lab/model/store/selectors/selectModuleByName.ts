import type { Module, ModuleName } from "../../types/module";
import type { LabStoreState } from "../store";

export const selectModuleByName =
	(moduleName: ModuleName) =>
	(state: LabStoreState): Module | undefined => {
		return state.modules.find((m) => m.name === moduleName);
	};
