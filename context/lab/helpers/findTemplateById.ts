import { allTemplates } from "@/data/templates";
import { BaseModuleTemplate } from "@/types/template";

export function findTemplateById(templateId: string): BaseModuleTemplate | undefined {
	return allTemplates.find((template) => template.id === templateId);
}
