import { TemplateSetting } from "@/types/template";

export function findTemplatePathById(templateSettings: TemplateSetting[], targetId: string): string[] | null {
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
}
