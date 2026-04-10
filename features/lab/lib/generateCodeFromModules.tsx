import type { Module } from "../model/types/module";
import { createSettings } from "./createSettings";

export function generateCodeFromModules(modules: Module[]): string {
	const { isMotionUsed, contentAsString, componentAttributes } = createSettings(modules);

	if (isMotionUsed === true) {
		const motionSettingsStringified = Object.entries(componentAttributes).map(([key, value]) => {
			return `${key}={${JSON.stringify(value)}}`;
		}, 1);

		return `<motion.div ${motionSettingsStringified.join(" ")}>${contentAsString}</motion.div>`;
	}

	return `<div>${contentAsString}</div>`;
}
