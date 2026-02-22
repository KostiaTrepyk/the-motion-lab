import { Module } from "@/types/modules";
import { createContext } from "react";

export interface LabContextType {
	modules: Module[];
	addModule: (module: Module) => void;
	removeModule: (moduleName: string) => void;
	changeModuleSetting: (
		moduleName: string,
		settingId: string,
		newValue: number | string | boolean,
	) => void;
	toggleSettingDisabled: (moduleName: string, settingId: string) => void;
	findModuleByName: (moduleName: string) => Module | undefined;
}

const defaultValue: LabContextType = {
	modules: [],
	addModule: () => {},
	removeModule: () => {},
	changeModuleSetting: () => {},
	toggleSettingDisabled: () => {},
	findModuleByName: () => undefined,
};

export const labContext = createContext<LabContextType>(defaultValue);
