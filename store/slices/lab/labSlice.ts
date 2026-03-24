import { allTemplates } from "@/data/templates";
import { createModuleFromTemplate } from "@/store/slices/lab/helpers/createModuleFromTemplate";
import { Module } from "@/types/modules";
import { StateCreator } from "zustand";
import { SharedState } from "../../store";

export interface LabSliceState {
	modules: Module[];
}

const initialModules: Module[] = allTemplates.reduce<Module[]>((acc, template) => {
	if (template.isRequired === true) {
		const newModule = createModuleFromTemplate(template);

		if (newModule === undefined) {
			console.error("Error occured in fn createModuleFromTemplate. Module was not created!");
			return acc;
		}

		acc.push(newModule);
	}
	return acc;
}, []);

export const createLabSlice: StateCreator<SharedState, [["zustand/immer", never]], [], LabSliceState> = () => ({
	modules: [...initialModules],
});
