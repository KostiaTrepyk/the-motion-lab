import { Setting } from "@/types/settings";

export function removeSettingById(settings: Setting[], targetSettingId: string): Setting[] {
	const result: Setting[] = [];

	for (const setting of settings) {
		if (setting.id === targetSettingId) {
			if (setting.isRequired === true) {
				console.warn(`Setting with id ${setting.id} cannot be removed! It is required`);
				result.push(setting);
			}
			continue;
		}

		if (setting.type === "object") {
			result.push({
				...setting,
				settings: removeSettingById(setting.settings, targetSettingId),
			});
		} else {
			result.push(setting);
		}
	}

	return result;
}
