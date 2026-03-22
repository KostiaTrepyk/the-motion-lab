import { Setting } from "@/types/settings";

export function toggleSettingById(settings: Setting[], targetSettingId: string): Setting[] {
	return [
		...settings.map((setting) => {
			if (setting.id === targetSettingId) {
				return { ...setting, isDisabled: !setting.isDisabled };
			}

			if (setting.type === "object") {
				return {
					...setting,
					settings: toggleSettingById(setting.settings, targetSettingId),
				};
			}

			return setting;
		}),
	];
}
