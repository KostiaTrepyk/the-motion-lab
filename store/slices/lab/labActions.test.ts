import { allTemplates } from "@/data/templates";
import { useAppStore } from "@/store/store";
import { ModuleName } from "@/types/modules";
import { labSliceActions } from "./labActions";

// Запоминаем изначальный стейт ПЕРЕД запуском тестов (пока он девственно чист)
const initialState = useAppStore.getState();
const requiredTemplates = allTemplates.filter((t) => t.isRequired);

describe("labActions", () => {
	// Сбрасываем стор перед КАЖДЫМ тестом (Изоляция)
	beforeEach(() => {
		// Второй аргумент `true` заставляет Zustand полностью перезаписать стейт,
		// а не просто слить (merge) старый с новым.
		useAppStore.setState(initialState, true);
	});

	describe("initialState", () => {
		it.each(requiredTemplates)("Should contain all required modules", () => {
			requiredTemplates.forEach((template) => {
				expect(useAppStore.getState().modules).toContainEqual(expect.objectContaining({ name: template.name }));
			});
		});
	});

	describe("findModuleByName", () => {
		it("should return undefined for non-existent module", () => {
			const result = labSliceActions.findModuleByName("NonExistentModule" as ModuleName);
			expect(result).toBeUndefined();
		});

		it("should return the correct module", () => {
			const targetModule = {
				id: "motion-1",
				name: "Motion" as ModuleName,
				collapsed: true,
				isRequired: true,
				settings: [],
				templateId: "temp-1",
			};

			const otherModule = {
				id: "motion-2",
				name: "Motion2" as ModuleName,
				collapsed: true,
				isRequired: true,
				settings: [],
				templateId: "temp-2",
			};

			useAppStore.setState({ modules: [targetModule, otherModule] });
			const result = labSliceActions.findModuleByName("Motion" as ModuleName);
			expect(result).toEqual(targetModule);
		});
	});

	describe("addModuleFromTemplate", () => {
		it("should not add any module if templateId is invalid", () => {
			const initialModules = useAppStore.getState().modules;

			labSliceActions.addModuleFromTemplate("invalid-template-id");

			expect(useAppStore.getState().modules).toEqual(initialModules);
		});

		it("should add a new module based on the template", () => {
			const template = allTemplates.find((t) => !requiredTemplates.some((rt) => rt.id === t.id));

			// No valid template found for testing, skip this test
			if (!template) return;

			const initialModules = useAppStore.getState().modules;

			labSliceActions.addModuleFromTemplate(template.id);

			const newModules = useAppStore.getState().modules;
			expect(newModules.length).toBe(initialModules.length + 1);
			expect(newModules.some((m) => m.templateId === template.id)).toBe(true);
		});
	});
});
