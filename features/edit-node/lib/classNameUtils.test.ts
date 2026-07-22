import { findClassWithPrefix, updateClassPrefix } from "./classNameUtils";

describe("classNameUtils", () => {
	describe("findClassWithPrefix", () => {
		it("должен находить класс с заданным префиксом", () => {
			expect(findClassWithPrefix("p-4 bg-slate-800 w-32 rounded-lg", "w")).toBe("w-32");
			expect(findClassWithPrefix("p-4 bg-slate-800 w-32 rounded-lg", "p")).toBe("p-4");
			expect(findClassWithPrefix("p-4 bg-slate-800 w-32 rounded-lg", "rounded")).toBe("rounded-lg");
		});

		it("должен возвращать пустую строку, если класс с префиксом не найден", () => {
			expect(findClassWithPrefix("p-4 bg-slate-800", "w")).toBe("");
			expect(findClassWithPrefix("", "w")).toBe("");
		});
	});

	describe("updateClassPrefix", () => {
		it("должен заменять существующий класс с префиксом", () => {
			const result = updateClassPrefix("p-4 w-32 bg-slate-800", "w", "w-full");
			expect(result).toBe("p-4 bg-slate-800 w-full");
		});

		it("должен добавлять класс с префиксом, если его раньше не было", () => {
			const result = updateClassPrefix("p-4 bg-slate-800", "w", "w-full");
			expect(result).toBe("p-4 bg-slate-800 w-full");
		});

		it("должен удалять класс с префиксом, если newValue пустой", () => {
			const result = updateClassPrefix("p-4 w-32 bg-slate-800", "w", "");
			expect(result).toBe("p-4 bg-slate-800");
		});
	});
});
