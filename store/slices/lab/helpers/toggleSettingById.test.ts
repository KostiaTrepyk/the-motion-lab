import { generateUniqueId } from "@/lib/generateUniqueId";
import { Setting } from "@/types/settings";
import { toggleSettingById } from "./toggleSettingById";

const fixture = [
	{
		id: generateUniqueId(),
		type: "object",
		label: "Initial",
		propertyName: "initial",
		collapsed: true,
		canBeDisabled: true,
		isDisabled: false,
		isRequired: false,
		templateSettingId: generateUniqueId(),
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
				templateSettingId: generateUniqueId(),
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
				templateSettingId: generateUniqueId(),
			},
		],
	},
	{
		id: generateUniqueId(),
		type: "object",
		label: "Animate",
		propertyName: "Animate",
		collapsed: true,
		canBeDisabled: true,
		isDisabled: false,
		isRequired: false,
		templateSettingId: generateUniqueId(),
		settings: [],
	},
	{
		id: generateUniqueId(),
		type: "select",
		label: "Select sth",
		propertyName: "Select sth",
		isDisabled: false,
		canBeDisabled: false,
		options: ["spring", "tween"],
		value: "spring",
		isRequired: true,
		templateSettingId: generateUniqueId(),
	},
] as const satisfies Setting[];

describe("toggleSettingById", () => {
	it("should not change any setting if it was not found", () => {
		const result = toggleSettingById(fixture, "some_unknown_id");
		expect(result).toEqual(fixture);
	});

	it("should not change setting if it is required", () => {
		const targetSetting = fixture[0].settings[1];
		const result = toggleSettingById(fixture, targetSetting.id);

		const clonedFixture = JSON.parse(JSON.stringify(fixture));

		expect(result).toEqual(clonedFixture);
	});

	it("should return correct immutable settings array", () => {
		const targetSetting = fixture[1];
		const result = toggleSettingById(fixture, targetSetting.id);

		const clonedFixture = JSON.parse(JSON.stringify(fixture));
		clonedFixture[1].isDisabled = !clonedFixture[1].isDisabled;

		expect(result).toEqual(clonedFixture);
	});
});
