import { allTemplates } from "../data/templates";
import { getTemplateById } from "./getTemplateById";

describe("getTemplateById", () => {
	it("should return undefined, if template with such id doesn't exist", () => {
		const result = getTemplateById("some-unknown-id");
		expect(result).toBeUndefined();
	});

	it("should return correct template, if it exists", () => {
		const result = getTemplateById(allTemplates[0].id);
		expect(result).toBe(allTemplates[0]);
	});

	it("should return correct template, if it exists", () => {
		const result = getTemplateById(allTemplates[1].id);
		expect(result).toBe(allTemplates[1]);
	});
});
