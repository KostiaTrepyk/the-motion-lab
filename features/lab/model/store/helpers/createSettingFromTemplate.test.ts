import { generateUniqueId } from "@/lib/generateUniqueId";
import type { NestedSetting, SelectSetting, SliderSetting, TextSetting } from "../../types/setting";
import type {
	TemplateNestedSetting,
	TemplateSelectSetting,
	TemplateSetting,
	TemplateSliderSetting,
	TemplateTextSetting,
} from "../../types/template";
import { createSettingFromTemplate } from "./createSettingFromTemplate";

const testSettingTemplates = {
	slider: {
		id: generateUniqueId(),
		canBeDisabled: true,
		isDisabled: false,
		label: "Nested-setting",
		propertyName: "Nested-setting",
		type: "slider",
		isRequired: true,
		max: 100,
		min: 0,
		value: 25,
		markers: [0, 50, 100],
		step: 25,
	} satisfies TemplateSliderSetting,
	text: {
		id: generateUniqueId(),
		canBeDisabled: true,
		isDisabled: false,
		label: "Nested-setting",
		propertyName: "Nested-setting",
		type: "text",
		isRequired: true,
		value: "Some value",
	} satisfies TemplateTextSetting,
	select: {
		id: generateUniqueId(),
		canBeDisabled: true,
		isDisabled: false,
		label: "Nested-setting",
		propertyName: "Nested-setting",
		type: "select",
		isRequired: true,
		value: "Some value",
		options: ["Some value", "Sth", "..."],
	} satisfies TemplateSelectSetting,
	nested: {
		id: generateUniqueId(),
		canBeDisabled: true,
		collapsed: false,
		isDisabled: false,
		label: "Nested-setting",
		propertyName: "Nested-setting",
		settings: [],
		type: "object",
		isRequired: true,
	} satisfies TemplateNestedSetting,
	nestedWithSettings: {
		id: generateUniqueId(),
		canBeDisabled: true,
		collapsed: false,
		isDisabled: false,
		label: "Nested-setting",
		propertyName: "Nested-setting",
		settings: [
			{
				id: generateUniqueId(),
				canBeDisabled: true,
				isDisabled: false,
				label: "Nested-setting",
				propertyName: "Nested-setting",
				type: "slider",
				isRequired: true,
				max: 100,
				min: 0,
				value: 25,
				markers: [0, 50, 100],
				step: 25,
			},
			{
				id: generateUniqueId(),
				canBeDisabled: true,
				isDisabled: false,
				label: "Nested-setting",
				propertyName: "Nested-setting",
				type: "text",
				isRequired: true,
				value: "Some value",
			},
		],
		type: "object",
		isRequired: true,
	} satisfies TemplateNestedSetting,
} as const;

const expectedResults = {
	slider: {
		id: generateUniqueId(),
		canBeDisabled: true,
		isDisabled: false,
		label: "Nested-setting",
		propertyName: "Nested-setting",
		type: "slider",
		isRequired: true,
		max: 100,
		min: 0,
		value: 25,
		markers: [0, 50, 100],
		step: 25,
		templateSettingId: testSettingTemplates.slider.id,
	} satisfies SliderSetting,

	text: {
		id: generateUniqueId(),
		canBeDisabled: true,
		isDisabled: false,
		label: "Nested-setting",
		propertyName: "Nested-setting",
		type: "text",
		isRequired: true,
		value: "Some value",
		templateSettingId: testSettingTemplates.text.id,
	} satisfies TextSetting,

	select: {
		id: generateUniqueId(),
		canBeDisabled: true,
		isDisabled: false,
		label: "Nested-setting",
		propertyName: "Nested-setting",
		type: "select",
		isRequired: true,
		value: "Some value",
		options: ["Some value", "Sth", "..."],
		templateSettingId: testSettingTemplates.select.id,
	} satisfies SelectSetting,

	nested: {
		id: generateUniqueId(),
		canBeDisabled: true,
		collapsed: false,
		isDisabled: false,
		label: "Nested-setting",
		propertyName: "Nested-setting",
		settings: [],
		type: "object",
		isRequired: true,
		templateSettingId: testSettingTemplates.nested.id,
	} satisfies NestedSetting,

	nestedWithSettings: {
		id: generateUniqueId(),
		canBeDisabled: true,
		collapsed: false,
		isDisabled: false,
		label: "Nested-setting",
		propertyName: "Nested-setting",
		settings: [
			{
				id: generateUniqueId(),
				canBeDisabled: true,
				isDisabled: false,
				label: "Nested-setting",
				propertyName: "Nested-setting",
				type: "slider",
				isRequired: true,
				max: 100,
				min: 0,
				value: 25,
				markers: [0, 50, 100],
				step: 25,
				templateSettingId: testSettingTemplates.nestedWithSettings.settings[0].id,
			},
			{
				id: generateUniqueId(),
				canBeDisabled: true,
				isDisabled: false,
				label: "Nested-setting",
				propertyName: "Nested-setting",
				type: "text",
				isRequired: true,
				value: "Some value",
				templateSettingId: testSettingTemplates.nestedWithSettings.settings[1].id,
			},
		],
		type: "object",
		isRequired: true,
		templateSettingId: testSettingTemplates.nestedWithSettings.id,
	} satisfies NestedSetting,
} as const;

describe("createSettingFromTemplate", () => {
	it("should throw an error if type is not correct", () => {
		expect(() =>
			createSettingFromTemplate({
				...testSettingTemplates.slider,
				type: "some-type",
			} as unknown as TemplateSetting),
		).toThrow(/Unknown template setting type/);
	});

	it("should create correct slider setting", () => {
		const result = createSettingFromTemplate(testSettingTemplates.slider);
		expect(result).toEqual({ ...expectedResults.slider, id: expect.any(String) });
	});

	it("should create correct text setting", () => {
		const result = createSettingFromTemplate(testSettingTemplates.text);
		expect(result).toEqual({ ...expectedResults.text, id: expect.any(String) });
	});

	it("should create correct select setting", () => {
		const result = createSettingFromTemplate(testSettingTemplates.select);
		expect(result).toEqual({ ...expectedResults.select, id: expect.any(String) });
	});

	it("should create correct nested setting", () => {
		const result = createSettingFromTemplate(testSettingTemplates.nested);
		expect(result).toEqual({ ...expectedResults.nested, id: expect.any(String) });
	});

	it("should create correct nested setting with nested settings", () => {
		const result = createSettingFromTemplate(testSettingTemplates.nestedWithSettings);
		const expectedSettings = expectedResults.nestedWithSettings.settings.map((setting) => ({
			...setting,
			id: expect.any(String),
		}));

		expect(result).toEqual({
			...expectedResults.nestedWithSettings,
			id: expect.any(String),
			settings: expectedSettings,
		});
	});
});
