import { Setting } from "@/types/settings";

export function removeSettingById(
	settings: Setting[],
	targetSettingId: string,
): { settings: Setting[]; isRemoved: boolean } {
	const result: Setting[] = [];
	let isRemoved: boolean = false;

	for (const setting of settings) {
		if (setting.id === targetSettingId) {
			if (setting.isRequired === true) {
				console.warn(`Setting with id ${setting.id} cannot be removed! It is required`);
				result.push(setting);
				continue;
			}
			isRemoved = true;
			continue;
		}

		if (setting.type === "object") {
			const filteredSettings = removeSettingById(setting.settings, targetSettingId);

			if (filteredSettings.isRemoved) {
				isRemoved = true;
				result.push({
					...setting,
					settings: filteredSettings.settings,
				});
				continue;
			}

			result.push(setting);
			continue;
		}

		result.push(setting);
	}

	return { settings: result, isRemoved };
}
