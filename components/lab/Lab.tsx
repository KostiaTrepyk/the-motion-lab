"use client";

import { motion } from "motion/react";
import { useState } from "react";
import Modules from "./components/modules/Modules";
import View from "./components/view/View";
import Settings from "./components/settings/Settings";
import Code from "./components/code/Code";
import { Module } from "@/types/modules";
import { EditorSetting } from "@/types/settings";
import { allModules, defaultModule } from "./modules";

export default function Lab() {
	const [modules, setModules] = useState<Module[]>([defaultModule]);

	function addModule(module: Module) {
		setModules((prevModules) => [...prevModules, module]);
	}

	function removeModule(moduleName: string) {
		setModules((prevModules) =>
			prevModules.filter((module) => module.name !== moduleName),
		);
	}

	function changeModuleSetting(
		moduleName: string,
		settingId: string,
		newValue: number | string,
	) {
		function updateSetting(setting: EditorSetting): EditorSetting {
			if (setting.type === "object") {
				return {
					...setting,
					settings: setting.settings.map((s) => updateSetting(s)),
				};
			}

			if (setting.id === settingId) {
				return { ...setting, value: newValue as any };
			}

			return setting;
		}

		setModules((prevModules) =>
			prevModules.map((module) => {
				if (module.name === moduleName) {
					const updatedSettings = module.settings.map((setting) =>
						updateSetting(setting),
					);
					return { ...module, settings: updatedSettings };
				}
				return module;
			}),
		);
	}

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ duration: 0.75 }}
			className="grid grid-cols-5 h-dvh"
		>
			<Modules
				className="border-neutral-900 border-r h-full"
				allModules={allModules}
				addModule={addModule}
			/>

			<div className="flex flex-col justify-between col-span-3 h-full">
				<View className="grow-5" modules={modules} />
				<Code modules={modules} />
			</div>

			<Settings
				className="border-neutral-900 border-l h-full"
				modules={modules}
				removeModule={removeModule}
				changeModuleSetting={changeModuleSetting}
			/>
		</motion.div>
	);
}
