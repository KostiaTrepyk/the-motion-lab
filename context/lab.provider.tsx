"use client";

import { useCallback, useLayoutEffect, useState } from "react";
import { labContext } from "./lab.context";
import { Module, ModuleName } from "@/types/modules";
import { BaseSetting, NestedSetting, Setting } from "@/types/settings";
import { allTemplates } from "@/components/lab/templates";
import { BaseModuleTemplate, TemplateSetting } from "@/types/template";
import { generateUniqueId } from "@/lib/generateUniqueId";

export default function LabProvider({ children }: React.PropsWithChildren) {
	const [modules, setModules] = useState<Module[]>([]);

	console.log(modules.find((m) => m.name === "Motion")?.settings);

	const findTemplateById = useCallback((templateId: string): BaseModuleTemplate | undefined => {
		return allTemplates.find((template) => template.id === templateId);
	}, []);

	const createModuleFromTemplate = useCallback(
		(templateId: string): Module | undefined => {
			const template = findTemplateById(templateId);

			if (template === undefined) {
				console.error(`Template with id ${templateId.toString()} was not found!`);
				return;
			}

			console.log("createModuleFromTemplate " + template.name);

			const requiredTemplateSettings: TemplateSetting[] = template.settings.filter((s) => s.isRequired);

			const newModule: Module = {
				name: template.name,
				collapsed: template.collapsed,
				settings: requiredTemplateSettings.map(createSettingFromTemplate),
			};

			return newModule;
		},
		[findTemplateById],
	);

	const findModuleByName = useCallback(
		(moduleName: ModuleName): Module | undefined => {
			return modules.find((module) => module.name === moduleName);
		},
		[modules],
	);

	const addModuleFromTemplate = useCallback(
		(templateId: string): void => {
			const template = findTemplateById(templateId);

			if (template === undefined) {
				console.error(`Template with id ${templateId.toString()} was not found!`);
				return;
			}

			const exists = findModuleByName(template.name);

			if (exists !== undefined) {
				console.error("Module already exists!");
				return;
			}

			const newModule = createModuleFromTemplate(templateId);

			if (newModule === undefined) {
				console.error("Error occurred in function addModuleFromTemplate. Module was not created!");
				return;
			}

			setModules((prevModules) => [...prevModules, newModule]);
		},
		[findTemplateById, findModuleByName, createModuleFromTemplate],
	);

	function removeModule(moduleName: ModuleName) {
		setModules((prevModules) => prevModules.filter((module) => module.name !== moduleName));
	}

	function changeSettingValue<S extends Exclude<Setting, NestedSetting>>(
		moduleName: ModuleName,
		settingId: S["id"],
		newValue: S["value"],
	): void {
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
	}

	function toggleSettingDisabled(moduleName: ModuleName, settingId: string): void {
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
	}

	// FIX!!! Проверяет только 1 слой параметров, но не проверяет вложенных параметров.
	function getUnusedTemplateSettings(templateId: string): TemplateSetting[] | undefined {
		const template = allTemplates.find((template) => template.id === templateId);

		if (template === undefined) return undefined;

		const foundModule = findModuleByName(template.name);

		if (foundModule === undefined) return undefined;

		return template.settings.filter((ts) => !foundModule.settings.some((ms) => ms.templateSettingId === ts.id));
	}

	const findTemplatePathById = useCallback(function findTemplatePathById(
		templateSettings: TemplateSetting[],
		targetId: string,
	): string[] | null {
		for (const ts of templateSettings) {
			if (ts.id === targetId) {
				return [ts.id];
			}

			if (ts.type === "object") {
				const nested = findTemplatePathById(ts.settings, targetId);
				if (nested !== null) {
					return [ts.id, ...nested];
				}
			}
		}

		return null;
	}, []);

	const addSetting = useCallback(
		(templateId: string, templateSettingId: string): void => {
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

			const doesModuleExist = Boolean(findModuleByName(template.name));

			setModules((prevModules) => {
				// Если модуля не существует, тогда мы его создаём и добавляем settings по path
				if (doesModuleExist === false) {
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
		},
		[findTemplateById, findTemplatePathById, findModuleByName, createModuleFromTemplate],
	);

	function removeSetting(moduleName: ModuleName, settingId: string): void {
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
	}

	// Auto-add required modules on initial load
	useLayoutEffect(() => {
		allTemplates.forEach((template) => {
			if (template.isRequired) addModuleFromTemplate(template.id);
		});
	}, [addModuleFromTemplate]);

	return (
		<labContext.Provider
			value={{
				modules,
				addModuleFromTemplate,
				removeModule,
				findModuleByName,

				changeSettingValue,
				toggleSettingDisabled,
				getUnusedTemplateSettings,
				addSetting,
				removeSetting,
			}}
		>
			{children}
		</labContext.Provider>
	);
}

// HELPERS
function createSettingFromTemplate(templateSetting: TemplateSetting): Setting {
	const base: BaseSetting = {
		id: generateUniqueId(),
		templateSettingId: templateSetting.id,
		label: templateSetting.label,
		propertyName: templateSetting.propertyName,
		isDisabled: templateSetting.isDisabled,
		canBeDisabled: templateSetting.canBeDisabled,
		isRequired: templateSetting.isRequired ?? false,
	};

	switch (templateSetting.type) {
		case "slider":
			return {
				...base,
				type: "slider",
				value: templateSetting.value,
				min: templateSetting.min,
				max: templateSetting.max,
				step: templateSetting.step,
				markers: templateSetting.markers ? [...templateSetting.markers] : undefined,
			};

		case "text":
			return {
				...base,
				type: "text",
				value: templateSetting.value,
			};

		case "select":
			return {
				...base,
				type: "select",
				value: templateSetting.value,
				options: [...templateSetting.options],
			};

		case "object":
			const ts: TemplateSetting[] = [];
			for (const s of templateSetting.settings) if (s.isRequired) ts.push(s);

			return {
				...base,
				type: "object",
				collapsed: templateSetting.collapsed,
				settings: ts.map(createSettingFromTemplate),
			};

		default:
			throw new Error(`Unknown template setting type: ${JSON.stringify(templateSetting)}`);
	}
}

function updateModuleSettingsFromTemplate(
	path: string[],
	templateSettings: TemplateSetting[],
	moduleSettings: Setting[],
): Setting[] {
	if (path.length === 0) return moduleSettings;

	const tsId = path.at(0);
	const exists = moduleSettings.find((s) => s.templateSettingId === tsId);

	// Получаем темплейт по которому можно создать setting
	const templateSetting = templateSettings.find((s) => s.id === tsId);
	if (templateSetting === undefined) {
		console.error(`Template setting with id ${tsId} not found!`);
		return moduleSettings; // Нужен ли rest или можно прошлый пульнуть?
	}

	// Если не существует, создаём.
	if (exists === undefined) {
		const ms = createSettingFromTemplate(templateSetting);

		// Если объект то проходимся и по ms.settings. templateSetting и moduleSetting должны иметь одинаковый type.
		if (ms.type === "object" && templateSetting.type === "object")
			return [
				...moduleSettings,
				{
					...ms,
					settings: updateModuleSettingsFromTemplate(
						path.toSpliced(0, 1),
						templateSetting.settings,
						ms.settings,
					),
				},
			];

		// Если не type !== "object" то возвращаем последние settings и проверяем дошли ли мы до конца path ( имеется в виду tsIds).
		if (path.length > 1) {
			console.error("Sth is wrong with path.");
		}

		return [...moduleSettings, ms];
	}

	// Если существует, тогда идём внутрь к дочерним settings если type === "object". Если не "object" тогда проверяем
	// дошли ли мы доконца tsIds
	if (exists.type === "object" && templateSetting.type === "object") {
		return moduleSettings.map((setting) => {
			if (setting.id === exists.id) {
				return {
					...exists,
					settings: updateModuleSettingsFromTemplate(
						path.toSpliced(0, 1),
						templateSetting.settings,
						exists.settings,
					),
				};
			}
			return setting;
		});
	}

	if (path.length > 1) {
		console.error("Sth is wrong with path.");
	}

	// Обрабатуем не "object"
	return moduleSettings;
}
