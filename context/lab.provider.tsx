"use client";

import { useState } from "react";
import { labContext } from "./lab.context";
import { Module } from "@/types/modules";
import { EditorSetting } from "@/types/settings";
import { defaultModule } from "@/components/lab/modules";

export default function LabProvider({ children }: React.PropsWithChildren) {
	const [modules, setModules] = useState<Module[]>([defaultModule]);

	function addModule(module: Module) {
		setModules((prevModules) => [...prevModules, module]);
	}

	function removeModule(moduleName: string) {
		setModules((prevModules) =>
			prevModules.filter((module) => module.name !== moduleName),
		);
	}

	function changeModuleSetting(
		moduleName: string,
		settingId: string,
		newValue: number | string | boolean,
	) {
		function updateSetting(setting: EditorSetting): EditorSetting {
			if (setting.type === "object") {
				return {
					...setting,
					settings: setting.settings.map((s) => updateSetting(s)),
				};
			}

			if (setting.id === settingId) {
				return { ...setting, value: newValue as any };
			}

			return setting;
		}

		setModules((prevModules) =>
			prevModules.map((module) => {
				if (module.name === moduleName) {
					const updatedSettings = module.settings.map((setting) =>
						updateSetting(setting),
					);
					return { ...module, settings: updatedSettings };
				}
				return module;
			}),
		);
	}

	function toggleSettingDisabled(moduleName: string, settingId: string) {
		function updateSetting(setting: EditorSetting): EditorSetting {
			if (setting.id === settingId) {
				return { ...setting, isDisabled: !setting.isDisabled };
			}

			if (setting.type === "object") {
				return {
					...setting,
					settings: setting.settings.map((s) => updateSetting(s)),
				};
			}

			return setting;
		}

		setModules((prevModules) =>
			prevModules.map((module) => {
				if (module.name === moduleName) {
					const updatedSettings = module.settings.map((setting) =>
						updateSetting(setting),
					);
					return { ...module, settings: updatedSettings };
				}
				return module;
			}),
		);
	}

	return (
		<labContext.Provider
			value={{
				modules,
				addModule,
				removeModule,
				changeModuleSetting,
				toggleSettingDisabled,
			}}
		>
			{children}
		</labContext.Provider>
	);
}
