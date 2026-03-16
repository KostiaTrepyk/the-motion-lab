import { Module } from "@/types/modules";
import { createSettings } from "../createSettings";

export function generateCodeFromModules(modules: Module[]): string {
	const { isMotionUsed, content, componentAttributes } = createSettings(modules);

	if (isMotionUsed === true) {
		const motionSettingsStringified = Object.entries(componentAttributes).map(([key, value]) => {
			return `${key}={${JSON.stringify(value)}}`;
		}, 1);

		return `<motion.div ${motionSettingsStringified.join(" ")}>${content}</motion.div>`;
	}

	return `<div>${content}</div>`;
}
