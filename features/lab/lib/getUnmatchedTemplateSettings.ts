import type { Setting } from "../model/types/setting";
import type { TemplateSetting } from "../model/types/template";

export function getUnmatchedTemplateSettings(
	templateSettings: TemplateSetting[],
	moduleSettings: Setting[],
): TemplateSetting[] {
	const result: TemplateSetting[] = [];

	for (const ts of templateSettings) {
		const ms = moduleSettings.find((ms) => ms.templateSettingId === ts.id);

		if (ms === undefined) {
			result.push(ts);
		} else if (ts.type === "object" && ms.type === "object") {
			const s = getUnmatchedTemplateSettings(ts.settings, ms.settings);

			if (s.length > 0) {
				result.push({ ...ts, settings: s });
			}
		} else if (ts.type !== ms.type) {
			console.error("Template settings and module setting has different types!");
		}
	}

	return result;
}
