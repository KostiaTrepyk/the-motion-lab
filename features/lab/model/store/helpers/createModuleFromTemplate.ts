import { generateUniqueId } from "@/lib/generateUniqueId";
import type { Module } from "../../types/module";
import type { ModuleTemplate, TemplateSetting } from "../../types/template";
import { createSettingFromTemplate } from "./createSettingFromTemplate";

export function createModuleFromTemplate(template: ModuleTemplate): Module {
	const requiredTemplateSettings: TemplateSetting[] = template.settings.filter((s) => s.isRequired);

	const newModule: Module = {
		id: generateUniqueId(),
		templateId: template.id,
		name: template.name,
		collapsed: template.collapsed,
		isRequired: template.isRequired,
		settings: requiredTemplateSettings.map(createSettingFromTemplate),
	};

	return newModule;
}
