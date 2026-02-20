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
}

const defaultValue: LabContextType = {
	modules: [],
	addModule: (module) => {},
	removeModule: (moduleName) => {},
	changeModuleSetting: (moduleName, settingId, newValue) => {},
	toggleSettingDisabled: (moduleName, settingId) => {},
};

export const labContext = createContext<LabContextType>(defaultValue);
