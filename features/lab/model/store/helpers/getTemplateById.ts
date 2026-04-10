import { allTemplates } from "../data/templates";
import type { ModuleTemplate } from "../../types/template";

export function getTemplateById(templateId: string): ModuleTemplate | undefined {
	return allTemplates.find((template) => template.id === templateId);
}
