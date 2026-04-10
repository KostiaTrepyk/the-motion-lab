import type { Setting } from "../../types/setting";
import type { TemplateSetting } from "../../types/template";
import { createSettingFromTemplate } from "./createSettingFromTemplate";

export function addSettingByPath(
	path: string[],
	templateSettings: TemplateSetting[],
	moduleSettings: Setting[],
): Setting[] {
	if (path.length === 0) return moduleSettings;

	const tsId = path.at(0);
	const exists = moduleSettings.find((s) => s.templateSettingId === tsId);

	// Получаем темплейт по которому можно создать setting
	const templateSetting = templateSettings.find((s) => s.id === tsId);
	if (templateSetting === undefined) {
		console.error(`Template setting with id ${tsId} not found!`);
		return moduleSettings; // Нужен ли rest или можно прошлый пульнуть?
	}

	// Если не существует, создаём.
	if (exists === undefined) {
		const ms = createSettingFromTemplate(templateSetting);

		// Если объект то проходимся и по ms.settings. templateSetting и moduleSetting должны иметь одинаковый type.
		if (ms.type === "object" && templateSetting.type === "object")
			return [
				...moduleSettings,
				{
					...ms,
					settings: addSettingByPath(path.toSpliced(0, 1), templateSetting.settings, ms.settings),
				},
			];

		// Если не type !== "object" то возвращаем последние settings и проверяем дошли ли мы до конца path ( имеется в виду tsIds).
		if (path.length > 1) {
			console.error("Sth is wrong with path.");
		}

		return [...moduleSettings, ms];
	}

	// Если существует, тогда идём внутрь к дочерним settings если type === "object". Если не "object" тогда проверяем
	// дошли ли мы доконца tsIds
	if (exists.type === "object" && templateSetting.type === "object") {
		return moduleSettings.map((setting) => {
			if (setting.id === exists.id) {
				return {
					...exists,
					settings: addSettingByPath(path.toSpliced(0, 1), templateSetting.settings, exists.settings),
				};
			}
			return setting;
		});
	}

	if (path.length > 1) {
		console.error("Sth is wrong with path.");
	}

	// Обрабатуем не "object"
	return moduleSettings;
}
