import { getUnmatchedTemplateSettings } from "../../../lib/getUnmatchedTemplateSettings";
import type { TemplateSetting } from "../../types/template";
import { getTemplateById } from "../helpers/getTemplateById";
import type { LabStoreState } from "../store";

export const selectUnusedTemplateSettings =
	(templateId: string) =>
	(state: LabStoreState): TemplateSetting[] | undefined => {
		const template = getTemplateById(templateId);

		if (template === undefined) {
			console.warn(`Template with id ${templateId} was not found!`);
			return undefined;
		}

		const foundModule = state.modules.find((module) => module.name === template.name);

		if (foundModule === undefined) {
			console.warn(`Module with name ${template.name} doesn't exist!`);
			return template.settings;
		}

		return getUnmatchedTemplateSettings(template.settings, foundModule.settings);
	};
