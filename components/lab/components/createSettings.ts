import { Module } from "@/types/modules";

function isModuleUsed(modules: Module[], moduleName: string): boolean {
	return modules.some((module) => module.name === moduleName);
}

export function createSettings(modules: Module[]) {
	let isMotionUsed = isModuleUsed(modules, "Motion");
	let content = "";
	const motionSettings: Record<
		"initial" | "animate" | "transition",
		Record<string, string | number>
	> = {
		initial: {},
		animate: {},
		transition: {},
	};

	for (const module of modules) {
		for (const setting of module.settings) {
			if (module.name === "Default") {
				if (setting.label === "Content" && setting.type === "text") {
					content = setting.value;
				}
			}

			if (module.name === "Motion") {
				if (setting.label === "Initial" && setting.type === "object") {
					setting.settings.forEach((s) => {
						if (s.type !== "object") {
							motionSettings.initial[s.label.toLowerCase()] =
								s.value;
						}
					});
				}
				if (setting.label === "Animate" && setting.type === "object") {
					setting.settings.forEach((s) => {
						if (s.type !== "object") {
							motionSettings.animate[s.label.toLowerCase()] =
								s.value;
						}
					});
				}
				if (
					setting.label === "Transition" &&
					setting.type === "object"
				) {
					setting.settings.forEach((s) => {
						if (s.type !== "object") {
							motionSettings.transition[s.label.toLowerCase()] =
								s.value;
						}
					});
				}
			}
		}
	}
	return { isMotionUsed, content, motionSettings };
}
