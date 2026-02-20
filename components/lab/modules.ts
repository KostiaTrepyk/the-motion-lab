import { generateUniqueId } from "@/lib/generateUniqueId";
import { DefaultModule, Module, MotionModule } from "@/types/modules";
import { EditorSetting } from "@/types/settings";

export function generateMotionSettings(): EditorSetting[] {
	return [
		{
			id: generateUniqueId(),
			type: "slider",
			label: "Opacity",
			propertyName: "opacity",
			value: 0,
			min: 0,
			max: 1,
			markers: [0, 0.25, 0.5, 0.75, 1],
		},
		{
			id: generateUniqueId(),
			type: "slider",
			label: "Scale",
			propertyName: "scale",
			value: 1,
			min: 0,
			max: 2,
			markers: [0, 0.5, 1, 1.5, 2],
		},
		{
			id: generateUniqueId(),
			type: "slider",
			label: "Rotate",
			propertyName: "rotate",
			value: 0,
			min: -720,
			max: 720,
			step: 5,
			markers: [-720, -540, -360, -180, 0, 180, 360, 540, 720],
		},
	];
}

export const defaultModule: DefaultModule = {
	name: "Default",
	collapsed: false,
	settings: [
		{
			id: generateUniqueId(),
			type: "text",
			label: "Content",
			propertyName: "content",
			value: "Element",
		},
	],
};

export const motionModule: MotionModule = {
	name: "Motion",
	collapsed: true,
	settings: [
		{
			id: generateUniqueId(),
			type: "object",
			label: "Initial",
			propertyName: "initial",
			collapsed: true,
			canBeDisabled: true,
			isDisabled: true,
			settings: generateMotionSettings(),
		},
		{
			id: generateUniqueId(),
			type: "object",
			label: "Animate",
			propertyName: "animate",
			collapsed: true,
			canBeDisabled: true,
			isDisabled: true,
			settings: generateMotionSettings(),
		},
		{
			id: generateUniqueId(),
			type: "object",
			label: "Transition",
			propertyName: "transition",
			collapsed: true,
			canBeDisabled: true,
			isDisabled: true,
			settings: [
				{
					id: generateUniqueId(),
					type: "slider",
					label: "Duration",
					propertyName: "duration",
					min: 0,
					max: 1,
					value: 0.25,
					step: 0.0125,
					markers: [0, 0.2, 0.4, 0.6, 0.8, 1],
				},
				{
					id: generateUniqueId(),
					type: "select",
					label: "Type",
					propertyName: "type",
					options: ["spring", "tween"],
					value: "spring",
				},
			],
		},
		{
			id: generateUniqueId(),
			type: "object",
			label: "While hover",
			propertyName: "whileHover",
			collapsed: true,
			canBeDisabled: true,
			isDisabled: true,
			settings: generateMotionSettings(),
		},
		{
			id: generateUniqueId(),
			type: "object",
			label: "While tap",
			propertyName: "whileTap",
			collapsed: true,
			canBeDisabled: true,
			isDisabled: true,
			settings: generateMotionSettings(),
		},
		{
			id: generateUniqueId(),
			type: "object",
			label: "While focus",
			propertyName: "whileFocus",
			collapsed: true,
			canBeDisabled: true,
			isDisabled: true,
			settings: generateMotionSettings(),
		},
		{
			id: generateUniqueId(),
			type: "object",
			label: "While in view",
			propertyName: "whileInView",
			collapsed: true,
			canBeDisabled: true,
			isDisabled: true,
			settings: generateMotionSettings(),
		},
		{
			id: generateUniqueId(),
			type: "object",
			label: "While drag",
			propertyName: "whileDrag",
			collapsed: true,
			canBeDisabled: true,
			isDisabled: true,
			settings: generateMotionSettings(),
		},
	],
};

/** All modules except the default module */
export const allModules: Module[] = [motionModule];
