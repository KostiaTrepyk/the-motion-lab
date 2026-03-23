import { generateUniqueId } from "@/lib/generateUniqueId";
import { BaseSetting, Setting } from "@/types/settings";
import { TemplateSetting } from "@/types/template";

export function createSettingFromTemplate(templateSetting: TemplateSetting): Setting {
	const base: BaseSetting = {
		id: generateUniqueId(),
		templateSettingId: templateSetting.id,
		label: templateSetting.label,
		propertyName: templateSetting.propertyName,
		isDisabled: templateSetting.isDisabled,
		canBeDisabled: templateSetting.canBeDisabled,
		isRequired: templateSetting.isRequired ?? false,
	};

	switch (templateSetting.type) {
		case "slider":
			return {
				...base,
				type: "slider",
				value: templateSetting.value,
				min: templateSetting.min,
				max: templateSetting.max,
				step: templateSetting.step,
				markers: templateSetting.markers ? [...templateSetting.markers] : undefined,
			};

		case "text":
			return {
				...base,
				type: "text",
				value: templateSetting.value,
			};

		case "select":
			return {
				...base,
				type: "select",
				value: templateSetting.value,
				options: [...templateSetting.options],
			};

		case "object":
			const ts: TemplateSetting[] = [];
			for (const s of templateSetting.settings) if (s.isRequired) ts.push(s);

			return {
				...base,
				type: "object",
				collapsed: templateSetting.collapsed,
				settings: ts.map(createSettingFromTemplate),
			};

		default:
			throw new Error(`Unknown template setting type: ${JSON.stringify(templateSetting)}`);
	}
}
