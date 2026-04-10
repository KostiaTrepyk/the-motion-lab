import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { allTemplates } from "./data/templates";
import type { Module } from "../types/module";
import { createModuleFromTemplate } from "./helpers/createModuleFromTemplate";

export interface LabStoreState {
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

export const useLabStore = create<LabStoreState>()(
	immer(() => ({
		modules: initialModules,
	})),
);
