import { NestedRecord } from "@/types/common";
import { Module } from "@/types/modules";
import { Setting } from "@/types/settings";
import { MotionNodeAnimationOptions } from "motion";

/** Helper function to convert editor settings to a nested record */
function convertSettings(settings: Setting[]): NestedRecord<string | number> {
	const result: ReturnType<typeof convertSettings> = {};

	settings.forEach((setting) => {
		if (setting.isDisabled && setting.canBeDisabled) return;

		if (setting.type === "object") {
			result[setting.propertyName] = {};

			setting.settings.forEach((s) => {
				if (s.isDisabled && s.canBeDisabled) return;

				if (s.type === "object") {
					(result[setting.propertyName] as any)[s.propertyName] = convertSettings(s.settings);
				} else {
					(result[setting.propertyName] as any)[s.propertyName] = s.value;
				}
			});
		} else {
			result[setting.propertyName] = setting.value;
		}
	});

	return result;
}

function isModuleUsed(modules: Module[], moduleName: Module["name"]): boolean {
	return modules.some((module) => module.name === moduleName);
}

export function createSettings(modules: Module[]) {
	const isMotionUsed = isModuleUsed(modules, "Motion");
	let content = "";
	let componentAttributes: MotionNodeAnimationOptions = {};

	for (const currentModule of modules) {
		switch (currentModule.name) {
			case "Default":
				currentModule.settings.forEach((setting) => {
					if (setting.propertyName === "content" && setting.type === "text") {
						content = setting.value;
					}
				});
				break;

			case "Motion":
				componentAttributes = {
					...componentAttributes,
					...convertSettings(currentModule.settings),
				};
				break;

			default:
				console.error(`Unknown module: ${currentModule.name}`);
		}
	}
	return { isMotionUsed, content, componentAttributes };
}
