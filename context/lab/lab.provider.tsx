"use client";

import { useCallback, useMemo, useState } from "react";
import { labContext, LabContextType } from "./lab.context";
import { Module, ModuleName } from "@/types/modules";
import { NestedSetting, Setting } from "@/types/settings";
import { allTemplates } from "@/data/templates";
import { TemplateSetting } from "@/types/template";
import { createModuleFromTemplate } from "./helpers/createModuleFromTemplate";
import { findTemplateById } from "./helpers/findTemplateById";
import { updateModuleSettingsFromTemplate } from "./helpers/updateModuleSettingsFromTemplate";
import { findTemplatePathById } from "./helpers/findTemplatePathById";

export default function LabProvider({ children }: React.PropsWithChildren) {
	const [modules, setModules] = useState<Module[]>(() => {
		const initialModules: Module[] = [];

		allTemplates.forEach((template) => {
			if (template.isRequired) {
				const newModule = createModuleFromTemplate(template.id);

				if (newModule === undefined) {
					console.error("");
					return;
				}

				initialModules.push(newModule);
			}
		});

		return initialModules;
	});

	const findModuleByName = useCallback(
		(moduleName: ModuleName): Module | undefined => {
			return modules.find((module) => module.name === moduleName);
		},
		[modules],
	);

	const addModuleFromTemplate = useCallback((templateId: string): void => {
		const template = findTemplateById(templateId);

		if (template === undefined) {
			console.error(`Template with id ${templateId.toString()} was not found!`);
			return;
		}

		setModules((prevModules) => {
			const exists = prevModules.find((m) => m.name === template.name);
			if (exists === undefined) {
				const newModule = createModuleFromTemplate(templateId);

				if (newModule === undefined) {
					console.error("Error occurred in function createModuleFromTemplate. Module was not created!");
					return prevModules;
				}

				return [...prevModules, newModule];
			}

			console.warn(`Module with name ${template.name} already exists.`);
			return prevModules;
		});
	}, []);

	const removeModule = useCallback((moduleName: ModuleName) => {
		setModules((prevModules) => {
			const exists = prevModules.findIndex((m) => m.name === moduleName);

			if (exists === -1) {
				console.warn(`Module with name ${moduleName} doesn't exist.`);
				return prevModules;
			}

			return prevModules.toSpliced(exists, 1);
		});
	}, []);

	const changeSettingValue = useCallback(
		<S extends Exclude<Setting, NestedSetting>>(
			moduleName: ModuleName,
			settingId: S["id"],
			newValue: S["value"],
		): void => {
			function updateSetting(setting: Setting): Setting {
				// Nested setting don't have value.
				if (setting.type === "object") {
					return {
						...setting,
						settings: setting.settings.map(updateSetting),
					};
				}

				if (setting.id !== settingId) return setting;

				if (setting.type === "slider") {
					if (typeof newValue !== "number") {
						console.error("Old value and new value has different types!");
						return setting;
					}
					return { ...setting, value: newValue };
				}

				if (setting.type === "text") {
					if (typeof newValue !== "string") {
						console.error("Old value and new value has different types!");
						return setting;
					}
					return { ...setting, value: newValue };
				}

				if (setting.type === "select") {
					if (typeof newValue !== "string") {
						console.error("Old value and new value has different types!");
						return setting;
					}

					const includes = setting.options.includes(newValue);

					if (includes === false) {
						console.error(`Unknown option: ${newValue}!`);
						return setting;
					}

					return { ...setting, value: newValue };
				}

				console.error("Unhandled value type!");

				return setting;
			}

			setModules((prevModules) =>
				prevModules.map((module) => {
					if (module.name === moduleName) {
						const updatedSettings = module.settings.map(updateSetting);
						return { ...module, settings: updatedSettings };
					}
					return module;
				}),
			);
		},
		[],
	);

	const toggleSettingDisabled = useCallback((moduleName: ModuleName, settingId: string): void => {
		function updateSetting(setting: Setting): Setting {
			if (setting.id === settingId) {
				return { ...setting, isDisabled: !setting.isDisabled };
			}

			if (setting.type === "object") {
				return {
					...setting,
					settings: setting.settings.map(updateSetting),
				};
			}

			return setting;
		}

		setModules((prevModules) =>
			prevModules.map((module) => {
				if (module.name === moduleName) {
					const updatedSettings = module.settings.map(updateSetting);
					return { ...module, settings: updatedSettings };
				}
				return module;
			}),
		);
	}, []);

	// FIX!!! Проверяет только 1 слой параметров, но не проверяет вложенных параметров.
	const getUnusedTemplateSettings = useCallback(
		(templateId: string): TemplateSetting[] | undefined => {
			const template = allTemplates.find((template) => template.id === templateId);

			if (template === undefined) return undefined;

			const foundModule = findModuleByName(template.name);

			if (foundModule === undefined) return undefined;

			return template.settings.filter((ts) => !foundModule.settings.some((ms) => ms.templateSettingId === ts.id));
		},
		[findModuleByName],
	);

	const addSetting = useCallback((templateId: string, templateSettingId: string): void => {
		const template = findTemplateById(templateId);

		if (template === undefined) {
			console.error(`Template with id ${templateId.toString()} not found.`);
			return;
		}

		const path = findTemplatePathById(template.settings, templateSettingId);

		if (path === null) {
			console.error(`Template setting with id ${templateSettingId.toString()} not found.`);
			return;
		}

		setModules((prevModules) => {
			const doesModuleExist = prevModules.find((m) => m.name === template.name);

			// Если модуля не существует, тогда мы его создаём и добавляем settings по path
			if (doesModuleExist === undefined) {
				const newModule = createModuleFromTemplate(templateId);

				if (newModule === undefined) {
					console.error("Error occurred in function addModuleFromTemplate. Module was not created!");
					return [...prevModules];
				}

				return [
					...prevModules,
					{
						...newModule,
						settings: updateModuleSettingsFromTemplate(path, template.settings, newModule.settings),
					},
				];
			}

			// Если модуль существует, тогда просто изменяем его settings
			return prevModules.map((prevModule) => {
				if (prevModule.name === template.name) {
					return {
						...prevModule,
						settings: updateModuleSettingsFromTemplate(path, template.settings, prevModule.settings),
					};
				}

				return prevModule;
			});
		});
	}, []);

	/* FIX ME!!!! В функции remove внутри removeSetting нет guard против того,
	 что settings модуля может стать пустым после удаления. Это не баг, просто косметика — UI должен это обрабатывать сам. */
	const removeSetting = useCallback((moduleName: ModuleName, settingId: string): void => {
		// Helper
		function remove(setting: Setting): Setting | null {
			if (setting.id === settingId && setting.isRequired === false) {
				return null;
			}

			if (setting.type === "object") {
				return {
					...setting,
					settings: setting.settings.map(remove).filter((s) => s !== null),
				};
			}

			return setting;
		}

		setModules((prevModules) =>
			prevModules.map((module) => {
				if (module.name === moduleName) {
					const updatedSettings = module.settings.map(remove).filter((s) => s !== null);

					return { ...module, settings: updatedSettings };
				}

				return module;
			}),
		);
	}, []);

	const contextValue: LabContextType = useMemo(
		() => ({
			modules,
			addModuleFromTemplate,
			removeModule,
			findModuleByName,

			changeSettingValue,
			toggleSettingDisabled,
			getUnusedTemplateSettings,
			addSetting,
			removeSetting,
		}),
		[
			modules,
			addModuleFromTemplate,
			removeModule,
			findModuleByName,
			changeSettingValue,
			toggleSettingDisabled,
			getUnusedTemplateSettings,
			addSetting,
			removeSetting,
		],
	);

	return <labContext.Provider value={contextValue}>{children}</labContext.Provider>;
}
