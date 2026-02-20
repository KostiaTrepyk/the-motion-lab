import { NestedRecord } from "@/types/common";
import { Module } from "@/types/modules";
import { EditorSetting } from "@/types/settings";
import { MotionNodeAnimationOptions } from "motion";

/** Helper function to convert editor settings to a nested record */
function convertSettings(
	settings: EditorSetting[],
): NestedRecord<string | number> {
	const result: ReturnType<typeof convertSettings> = {};

	settings.forEach((setting) => {
		if (setting.isDisabled && setting.canBeDisabled) return;

		if (setting.type === "object") {
			result[setting.propertyName] = {};

			setting.settings.forEach((s) => {
				if (s.isDisabled && s.canBeDisabled) return;

				if (s.type === "object") {
					(result[setting.propertyName] as any)[s.propertyName] =
						convertSettings(s.settings);
				} else {
					(result[setting.propertyName] as any)[s.propertyName] =
						s.value;
				}
			});
		} else {
			result[setting.propertyName] = setting.value;
		}
	});

	return result;
}

function isModuleUsed(modules: Module[], moduleName: string): boolean {
	return modules.some((module) => module.name === moduleName);
}

export function createSettings(modules: Module[]) {
	let isMotionUsed =
		isModuleUsed(modules, "Motion") || isModuleUsed(modules, "Hover");
	let content = "";
	let componentAttributes: MotionNodeAnimationOptions = {};

	for (const module of modules) {
		switch (module.name) {
			case "Default":
				module.settings.forEach((setting) => {
					if (
						setting.propertyName === "content" &&
						setting.type === "text"
					) {
						content = setting.value;
					}
				});
				break;

			case "Motion":
				componentAttributes = {
					...componentAttributes,
					...convertSettings(module.settings),
				};
				break;

			default:
				// @ts-ignore
				console.error(`Unknown module: ${module.name}`);
		}
	}
	return { isMotionUsed, content, componentAttributes };
}
