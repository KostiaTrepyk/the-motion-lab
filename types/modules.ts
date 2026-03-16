import { Setting } from "./settings";

export type ModuleName = "Default" | "Motion";

export interface Module {
	name: ModuleName;
	collapsed: boolean; // Для UI, чтобы знать, свернут ли модуль
	settings: Setting[];
}

export interface DefaultModule extends Module {
	name: "Default";
	settings: Setting[];
}

export interface MotionModule extends Module {
	name: "Motion";
	settings: Setting[];
}
