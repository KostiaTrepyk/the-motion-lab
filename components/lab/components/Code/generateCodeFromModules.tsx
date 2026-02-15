import { Module } from "@/types/modules";

function isModuleUsed(modules: Module[], moduleName: string): boolean {
	return modules.some((module) => module.name === moduleName);
}

export function generateCodeFromModules(modules: Module[]): string {
	let isMotionUsed = isModuleUsed(modules, "Motion");
	let content = "";
	const motionSettings: Record<
		"initial" | "animate",
		Record<string, string | number>
	> = {
		initial: {},
		animate: {},
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
			}
		}
	}

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
