import { castDraft, type Draft } from "immer";
import type { Module, ModuleName } from "../types/module";
import type { CanvasNode } from "../types/nodes";
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

	changeSelectedNode: (newSelectedNodeId: string | null) => void;
	addNode: (newNode: CanvasNode, parentId?: string | null) => void;
	removeNode: (nodeId: string) => void;
}

function findNodeById(nodes: CanvasNode[], nodeId: string): CanvasNode | undefined {
	for (const node of nodes) {
		// 1. Проверяем сам узел
		if (node.id === nodeId) {
			return node;
		}
		// 2. Если есть дети-массивы — ищем в них
		else if ("children" in node && Array.isArray(node.children)) {
			const found = findNodeById(node.children, nodeId);
			// Возвращаем ТОЛЬКО если нашли. Иначе продолжаем крутить цикл!
			if (found) return found;
		}
	}
	return undefined;
}

function changeSelectedNode(newSelectedNodeId: string | null): void {
	if (newSelectedNodeId === null) {
		useLabStore.setState((state) => {
			state.selectedNodeId = null;
		});
		return;
	}

	const nodes = useLabStore.getState().nodes;
	const node = findNodeById(nodes, newSelectedNodeId);

	if (node === undefined) {
		console.warn(`Node with id ${newSelectedNodeId} was not found!`);
		useLabStore.setState((state) => {
			state.selectedNodeId = null;
		});
		return;
	}

	useLabStore.setState((state) => {
		state.selectedNodeId = newSelectedNodeId;
	});
}

function findNodeInDraft(nodes: Draft<CanvasNode[]>, id: string): Draft<CanvasNode> | undefined {
	for (const node of nodes) {
		if (node.id === id) return node;
		if ("children" in node && Array.isArray(node.children)) {
			const found = findNodeInDraft(node.children, id);
			if (found) return found;
		}
	}
	return undefined;
}

function addNode(newNode: CanvasNode, parentId: string | null = null): void {
	useLabStore.setState((state) => {
		if (!parentId) {
			state.nodes.push(castDraft(newNode));
			return;
		}

		const parent = findNodeInDraft(state.nodes, parentId);

		if (parent && "children" in parent && Array.isArray(parent.children)) {
			// 2. Здесь тоже обязательно нужен castDraft
			parent.children.push(castDraft(newNode));
		} else {
			console.warn("Parent not found or cannot have children. Adding to root.");
			state.nodes.push(castDraft(newNode));
		}
	});
}

function removeNode(nodeId: string): void {
	useLabStore.setState((state) => {
		function findAndRemove(nodes: Draft<CanvasNode[]>): boolean {
			for (let i = 0; i < nodes.length; i++) {
				if (nodes[i].id === nodeId) {
					nodes.splice(i, 1); // Immer позволяет использовать splice!
					return true;
				}

				const node = nodes[i];
				if ("children" in node && Array.isArray(node.children)) {
					// Рекурсивно ищем в детях
					if (findAndRemove(node.children)) {
						return true;
					}
				}
			}
			return false;
		}

		findAndRemove(state.nodes);

		// Защита от багов: если мы удалили тот узел, который сейчас выделен, сбрасываем выделение
		if (state.selectedNodeId === nodeId) {
			state.selectedNodeId = null;
		}
	});
}

function findModuleByName(moduleName: ModuleName): Module | undefined {
	return useLabStore.getState().nodes.find((module) => module.name === moduleName);
}

function addModuleFromTemplate(templateId: string): void {
	const template = getTemplateById(templateId);

	if (template === undefined) {
		console.error(`Template with id ${templateId.toString()} was not found!`);
		return;
	}

	const exists = useLabStore.getState().nodes.find((m) => m.name === template.name);
	if (exists === undefined) {
		const newModule = createModuleFromTemplate(template);

		if (newModule === undefined) {
			console.error("Error occurred in function createModuleFromTemplate. Module was not created!");
			return;
		}

		useLabStore.setState((draft) => {
			return { modules: [...draft.nodes, newModule] };
		});
	}
}

function removeModule(moduleName: ModuleName) {
	const modules = useLabStore.getState().nodes;
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
		return { modules: draft.nodes.toSpliced(targetId, 1) };
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
		const updated = draft.nodes.map((module) => {
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
		const updated = draft.nodes.map((module) => {
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
		const doesModuleExist = draft.nodes.find((m) => m.name === template.name);

		// Если модуля не существует, тогда мы его создаём и добавляем settings по path
		if (doesModuleExist === undefined) {
			const newModule = createModuleFromTemplate(template);

			if (newModule === undefined) {
				console.error("Error occurred in function createModuleFromTemplate. Module was not created!");
				return {};
			}

			return {
				modules: [
					...draft.nodes,
					{
						...newModule,
						settings: addSettingByPath(path, template.settings, newModule.settings),
					},
				],
			};
		}

		// Если модуль существует, тогда просто изменяем его settings
		return {
			modules: draft.nodes.map((m) => {
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
	const modules = useLabStore.getState().nodes;

	const mId = modules.findIndex((m) => m.name === moduleName);
	if (mId === -1) {
		console.warn(`Module with name ${moduleName} was not found!`);
		return;
	}

	const m = modules[mId];
	const filteredSettings = helperRemoveSettingById(m.settings, targetSettingId);

	if (filteredSettings.isRemoved === false) return;

	useLabStore.setState((state) => ({
		modules: state.nodes.toSpliced(mId, 1, { ...m, settings: filteredSettings.settings }),
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

	changeSelectedNode,
	addNode,
	removeNode,
};
