import { Module } from "@/types/modules";
import { createSettings } from "../createSettings";

function isModuleUsed(modules: Module[], moduleName: string): boolean {
	return modules.some((module) => module.name === moduleName);
}

export function generateCodeFromModules(modules: Module[]): string {
	const { isMotionUsed, content, componentAttributes } =
		createSettings(modules);

	if (isMotionUsed === true) {
		const motionSettingsStringified = Object.entries(
			componentAttributes,
		).map(([key, value]) => {
			return `${key}={${JSON.stringify(value)}}`;
		}, 1);

		return `<motion.div ${motionSettingsStringified.join(" ")}>${content}</motion.div>`;
	}

	return `<div>${content}</div>`;
}
