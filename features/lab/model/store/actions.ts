import type { Module, ModuleName } from "../types/module";
import type { NestedSetting, Setting } from "../types/setting";
import { addSettingByPath } from "./helpers/addSettingByPath";
import { createModuleFromTemplate } from "./helpers/createModuleFromTemplate";
import { findTemplatePathById } from "./helpers/findTemplatePathById";
import { getTemplateById } from "./helpers/getTemplateById";
import { removeSettingById as helperRemoveSettingById } from "./helpers/removeSettingById";
import { toggleSettingById } from "./helpers/toggleSettingById";
import { useLabStore } from "./store";

export interface LabStoreActions {
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

function findModuleByName(moduleName: ModuleName): Module | undefined {
	return useLabStore.getState().modules.find((module) => module.name === moduleName);
}

function addModuleFromTemplate(templateId: string): void {
	const template = getTemplateById(templateId);

	if (template === undefined) {
		console.error(`Template with id ${templateId.toString()} was not found!`);
		return;
	}

	const exists = useLabStore.getState().modules.find((m) => m.name === template.name);
	if (exists === undefined) {
		const newModule = createModuleFromTemplate(template);

		if (newModule === undefined) {
			console.error("Error occurred in function createModuleFromTemplate. Module was not created!");
			return;
		}

		useLabStore.setState((draft) => {
			return { modules: [...draft.modules, newModule] };
		});
	}
}

function removeModule(moduleName: ModuleName) {
	const modules = useLabStore.getState().modules;
	const targetId = modules.findIndex((m) => m.name === moduleName);

	if (targetId === -1) {
		console.warn(`Module with name ${moduleName} doesn't exist.`);
		return;
	}

	if (modules[targetId].isRequired) {
		console.warn(`Module with name ${moduleName} is required and can't be removed.`);
		return;
	}

	useLabStore.setState((draft) => {
		return { modules: draft.modules.toSpliced(targetId, 1) };
	});
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

		if (setting.type === "component") {
			if (typeof newValue !== "string") {
				console.error("Old value and new value has different types!");
				return setting;
			}

			return { ...setting, value: newValue };
		}

		console.error("Unhandled value type!");

		return setting;
	}

	useLabStore.setState((draft) => {
		const updated = draft.modules.map((module) => {
			if (module.name === moduleName) {
				const updatedSettings = module.settings.map(updateSetting);
				return { ...module, settings: updatedSettings };
			}
			return module;
		});
		return { modules: updated };
	});
}

function toggleSettingDisabled(moduleName: ModuleName, targetSettingId: string): void {
	useLabStore.setState((draft) => {
		const updated = draft.modules.map((module) => {
			if (module.name === moduleName) {
				const updatedSettings = toggleSettingById(module.settings, targetSettingId);
				return { ...module, settings: updatedSettings };
			}
			return module;
		});

		return { modules: updated };
	});
}

function addSetting(templateId: string, templateSettingId: string): void {
	const template = getTemplateById(templateId);

	if (template === undefined) {
		console.error(`Template with id ${templateId.toString()} not found.`);
		return;
	}

	const path = findTemplatePathById(template.settings, templateSettingId);

	if (path === undefined) {
		console.error(`Template setting with id ${templateSettingId.toString()} not found.`);
		return;
	}

	useLabStore.setState((draft) => {
		const doesModuleExist = draft.modules.find((m) => m.name === template.name);

		// Если модуля не существует, тогда мы его создаём и добавляем settings по path
		if (doesModuleExist === undefined) {
			const newModule = createModuleFromTemplate(template);

			if (newModule === undefined) {
				console.error("Error occurred in function createModuleFromTemplate. Module was not created!");
				return {};
			}

			return {
				modules: [
					...draft.modules,
					{
						...newModule,
						settings: addSettingByPath(path, template.settings, newModule.settings),
					},
				],
			};
		}

		// Если модуль существует, тогда просто изменяем его settings
		return {
			modules: draft.modules.map((m) => {
				if (m.name === template.name) {
					return {
						...m,
						settings: addSettingByPath(path, template.settings, m.settings),
					};
				}

				return m;
			}),
		};
	});
}

function removeSettingById(moduleName: ModuleName, targetSettingId: string): void {
	const modules = useLabStore.getState().modules;

	const mId = modules.findIndex((m) => m.name === moduleName);
	if (mId === -1) {
		console.warn(`Module with name ${moduleName} was not found!`);
		return;
	}

	const m = modules[mId];
	const filteredSettings = helperRemoveSettingById(m.settings, targetSettingId);

	if (filteredSettings.isRemoved === false) return;

	useLabStore.setState((state) => ({
		modules: state.modules.toSpliced(mId, 1, { ...m, settings: filteredSettings.settings }),
	}));
}

export const labStoreActions: LabStoreActions = {
	findModuleByName,
	addModuleFromTemplate,
	removeModule,
	changeSettingValue,
	toggleSettingDisabled,
	addSetting,
	removeSettingById,
};
