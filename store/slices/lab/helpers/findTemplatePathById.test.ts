import { generateMotionSettings } from "@/data/templates";
import { generateUniqueId } from "@/lib/generateUniqueId";
import { TemplateSetting } from "@/types/template";
import { findTemplatePathById } from "./findTemplatePathById";

const fixture = [
	{
		id: generateUniqueId(),
		type: "object",
		label: "Initial",
		propertyName: "initial",
		collapsed: true,
		canBeDisabled: true,
		isDisabled: false,
		settings: generateMotionSettings(),
	},
	{
		id: generateUniqueId(),
		type: "object",
		label: "Animate",
		propertyName: "animate",
		collapsed: true,
		canBeDisabled: true,
		isDisabled: false,
		settings: generateMotionSettings(),
	},
	{
		id: generateUniqueId(),
		type: "object",
		label: "Transition",
		propertyName: "transition",
		collapsed: true,
		canBeDisabled: true,
		isDisabled: false,
		settings: [
			{
				id: generateUniqueId(),
				type: "slider",
				label: "Duration",
				propertyName: "duration",
				isDisabled: false,
				canBeDisabled: false,
				min: 0,
				max: 1,
				value: 0.25,
				step: 0.0125,
				markers: [0, 0.2, 0.4, 0.6, 0.8, 1],
				isRequired: true,
			},
			{
				id: generateUniqueId(),
				type: "select",
				label: "Type",
				propertyName: "type",
				isDisabled: false,
				canBeDisabled: false,
				options: ["spring", "tween"],
				value: "spring",
				isRequired: true,
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
		isDisabled: false,
		settings: generateMotionSettings(),
	},
	{
		id: generateUniqueId(),

		type: "object",
		label: "While tap",
		propertyName: "whileTap",
		collapsed: true,
		canBeDisabled: true,
		isDisabled: false,
		settings: generateMotionSettings(),
	},
	{
		id: generateUniqueId(),
		type: "object",
		label: "While focus",
		propertyName: "whileFocus",
		collapsed: true,
		canBeDisabled: true,
		isDisabled: false,
		settings: generateMotionSettings(),
	},
	{
		id: generateUniqueId(),
		type: "object",
		label: "While in view",
		propertyName: "whileInView",
		collapsed: true,
		canBeDisabled: true,
		isDisabled: false,
		settings: generateMotionSettings(),
	},
	{
		id: generateUniqueId(),
		type: "object",
		label: "While drag",
		propertyName: "whileDrag",
		collapsed: true,
		canBeDisabled: true,
		isDisabled: false,
		settings: generateMotionSettings(),
	},
] as const satisfies TemplateSetting[];

describe("findTemplatePathById", () => {
	it("should return undefined if setting was not found", () => {
		const result = findTemplatePathById(fixture, "some-unknown-id");
		expect(result).toBeUndefined();
	});

	it("should return correct path", () => {
		const targetSetting = fixture[3].settings[2];
		const result = findTemplatePathById(fixture, targetSetting.id);
		expect(result).toEqual([fixture[3].id, targetSetting.id]);
	});

	it("should return correct path", () => {
		const targetSetting = fixture[5];
		const result = findTemplatePathById(fixture, targetSetting.id);
		expect(result).toEqual([targetSetting.id]);
	});
});
