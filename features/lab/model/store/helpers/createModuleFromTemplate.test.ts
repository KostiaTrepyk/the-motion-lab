import type { Module } from "../../types/module";
import type { ModuleTemplate } from "../../types/template";
import { createModuleFromTemplate } from "./createModuleFromTemplate";

const template1: ModuleTemplate = {
	id: "template-1",
	name: "Default",
	collapsed: false,
	isRequired: true,
	settings: [],
} as const;

const expectedModule1: Module = {
	...template1,
	templateId: template1.id,
	id: "module-1", // can be any string
	settings: [],
} as const;

const template2: ModuleTemplate = {
	id: "template-2",
	name: "Default",
	collapsed: false,
	isRequired: true,
	settings: [
		{
			id: "setting-1",
			type: "text",
			label: "text",
			propertyName: "text",
			value: "",
			isDisabled: false,
			canBeDisabled: true,
			isRequired: true,
		},
		{
			id: "setting-2",
			type: "select",
			label: "text",
			propertyName: "text",
			value: "",
			options: ["text", "sth", "..."],
			isDisabled: false,
			canBeDisabled: true,
			isRequired: false,
		},
	],
} as const;

const expectedModule2: Module = {
	...template2,
	templateId: template2.id,
	id: "module-2", // can be any string
	settings: [
		{
			id: "setting-1",
			type: "text",
			label: "text",
			propertyName: "text",
			value: "",
			isDisabled: false,
			canBeDisabled: true,
			isRequired: true,
			templateSettingId: "setting-1",
		},
	],
} as const;

describe("createModuleFromTemplate", () => {
	it("should create correct module", () => {
		expect(createModuleFromTemplate(template1)).toEqual({
			...expectedModule1,
			id: expect.any(String),
		});
	});

	it("should create correct module with required settings", () => {
		expect(createModuleFromTemplate(template2)).toEqual({
			...expectedModule2,
			id: expect.any(String),
			settings: expectedModule2.settings.map((s) => ({
				...s,
				id: expect.any(String),
				templateSettingId: expect.any(String),
			})),
		});
	});
});
