import { useViewStore } from "./store";

describe("useViewStore", () => {
	beforeEach(() => {
		useViewStore.setState({ viewBackground: "dark" });
	});

	it("должен обновлять состояние viewBackground", () => {
		useViewStore.getState().setViewBackground("light");
		expect(useViewStore.getState().viewBackground).toBe("light");

		useViewStore.getState().setViewBackground("grid");
		expect(useViewStore.getState().viewBackground).toBe("grid");

		useViewStore.getState().setViewBackground("dark");
		expect(useViewStore.getState().viewBackground).toBe("dark");
	});
});
