import { allTemplates } from "@/data/templates";
import { createModuleFromTemplate } from "@/store/slices/lab/helpers/createModuleFromTemplate";
import { Module, ModuleName } from "@/types/modules";
import { NestedSetting, Setting } from "@/types/settings";
import { StateCreator } from "zustand";
import { SharedState } from "../../store";

export interface LabSliceState {
	modules: Module[];
}

export interface LabSliceActions {
	addModuleFromTemplate: (templateId: string) => void;
	removeModule: (moduleName: ModuleName) => void;
	findModuleByName: (moduleName: ModuleName) => Module | undefined;

	changeSettingValue: <S extends Exclude<Setting, NestedSetting>>(
		moduleName: ModuleName,
		targetSettingId: S["id"],
		newValue: S["value"],
	) => void;
	toggleSettingDisabled: (moduleName: ModuleName, targetSettingId: string) => void;
	addSetting: (templateId: string, templateSettingId: string) => void;
	removeSettingById: (moduleName: ModuleName, targetSettingId: string) => void;
}

const initialModules: Module[] = allTemplates.reduce<Module[]>((acc, template) => {
	if (template.isRequired === true) {
		const newModule = createModuleFromTemplate(template.id);

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
