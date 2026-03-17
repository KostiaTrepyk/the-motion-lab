import { createContext } from "react";
import { Module, ModuleName } from "@/types/modules";
import { NestedSetting, Setting } from "@/types/settings";
import { TemplateSetting } from "@/types/template";

export interface LabContextType {
	modules: Module[];
	addModuleFromTemplate: (templateId: string) => void;
	removeModule: (moduleName: ModuleName) => void;
	findModuleByName: (moduleName: ModuleName) => Module | undefined;

	changeSettingValue: <S extends Exclude<Setting, NestedSetting>>(
		moduleName: ModuleName,
		targetSettingId: S["id"],
		newValue: S["value"],
	) => void;
	toggleSettingDisabled: (moduleName: ModuleName, targetSettingId: string) => void;
	getUnusedTemplateSettings: (templateId: string) => TemplateSetting[] | undefined;
	addSetting: (templateId: string, templateSettingId: string) => void;
	removeSettingById: (moduleName: ModuleName, targetSettingId: string) => void;
}

const defaultValue: LabContextType = {
	modules: [],
	addModuleFromTemplate: () => {},
	removeModule: () => {},
	findModuleByName: () => undefined,

	changeSettingValue: () => {},
	toggleSettingDisabled: () => {},
	getUnusedTemplateSettings: () => undefined,
	addSetting: () => {},
	removeSettingById: () => {},
};

export const labContext = createContext<LabContextType>(defaultValue);
