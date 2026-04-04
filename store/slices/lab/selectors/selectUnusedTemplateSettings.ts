import { getTemplateById } from "@/store/slices/lab/helpers/getTemplateById";
import { getUnmatchedTemplateSettings } from "@/store/slices/lab/helpers/getUnmatchedTemplateSettings";
import { TemplateSetting } from "@/types/template";
import { LabSliceState } from "../labSlice";

export const selectUnusedTemplateSettings =
	(templateId: string) =>
	(state: LabSliceState): TemplateSetting[] | undefined => {
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
