import { TemplateSetting } from "@/types/template";

export function findTemplatePathById(templateSettings: TemplateSetting[], targetId: string): string[] | undefined {
	for (const ts of templateSettings) {
		if (ts.id === targetId) {
			return [ts.id];
		}

		if (ts.type === "object") {
			const nested = findTemplatePathById(ts.settings, targetId);
			if (nested !== undefined) {
				return [ts.id, ...nested];
			}
		}
	}

	return undefined;
}
