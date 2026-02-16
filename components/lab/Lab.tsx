"use client";

import { motion, TargetAndTransition, Transition } from "motion/react";
import { useState } from "react";
import Modules from "./components/Modules";
import View from "./components/view/View";
import Settings from "./components/settings/Settings";
import { generateUniqueId } from "@/lib/generateUniqueId";
import Code from "./components/code/Code";
import { DefaultModule, Module, MotionModule } from "@/types/modules";
import { EditorSetting } from "@/types/settings";

const defaultModule: DefaultModule = {
	name: "Default",
	settings: [
		{
			id: generateUniqueId(),
			type: "text",
			label: "Content",
			value: "Element",
		},
	],
};

function generateMotionSettings(): EditorSetting[] {
	return [
		{
			id: generateUniqueId(),
			type: "slider",
			label: "Opacity",
			value: 0,
			min: 0,
			max: 1,
			markers: [0, 0.25, 0.5, 0.75, 1],
		},
		{
			id: generateUniqueId(),
			type: "slider",
			label: "Scale",
			value: 1,
			min: 0,
			max: 5,
			markers: [0, 0.5, 1, 1.5, 2.5, 5],
		},
		{
			id: generateUniqueId(),
			type: "slider",
			label: "Rotate",
			value: 0,
			min: -720,
			max: 720,
			step: 5,
			markers: [-720, -540, -360, -180, 0, 180, 360, 540, 720],
		},
	];
}

const motionModule: MotionModule = {
	name: "Motion",
	settings: [
		{
			id: generateUniqueId(),
			type: "object",
			label: "Initial",
			settings: generateMotionSettings(),
		},
		{
			id: generateUniqueId(),
			type: "object",
			label: "Animate",
			settings: generateMotionSettings(),
		},
		// {
		// 	id: generateUniqueId(),
		// 	type: "object",
		// 	label: "Exit",
		// 	settings: generateMotionSettings(),
		// },
	],
};

// const test: TargetAndTransition = {};

/** All modules except the default module */
const allModules: Module[] = [motionModule];

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
