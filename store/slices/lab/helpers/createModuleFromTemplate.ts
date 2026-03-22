import { Module } from "@/types/modules";
import { TemplateSetting } from "@/types/template";
import { getTemplateById } from "./getTemplateById";
import { createSettingFromTemplate } from "./createSettingFromTemplate";

export function createModuleFromTemplate(templateId: string): Module | undefined {
	const template = getTemplateById(templateId);

	if (template === undefined) {
		console.error(`Template with id ${templateId.toString()} was not found!`);
		return;
	}

	const requiredTemplateSettings: TemplateSetting[] = template.settings.filter((s) => s.isRequired);

	const newModule: Module = {
		name: template.name,
		collapsed: template.collapsed,
		settings: requiredTemplateSettings.map(createSettingFromTemplate),
	};

	return newModule;
}
