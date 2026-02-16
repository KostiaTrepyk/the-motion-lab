import { Module } from "@/types/modules";
import { createSettings } from "../createSettings";

function isModuleUsed(modules: Module[], moduleName: string): boolean {
	return modules.some((module) => module.name === moduleName);
}

export function generateCodeFromModules(modules: Module[]): string {
	const { isMotionUsed, content, motionSettings } = createSettings(modules);

	if (isMotionUsed === true) {
		const motionSettingsStringified = Object.entries(motionSettings).map(
			([key, value]) => {
				return `${key}={${JSON.stringify(value)}}`;
			},
		);

		return `<motion.div ${motionSettingsStringified.join(" ")}>${content}</motion.div>`;
	}

	return `<div>${content}</div>`;
}
