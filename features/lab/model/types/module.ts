import type { Setting } from "./setting";

export type ModuleName = "Default" | "Motion";

export interface Module {
	id: string;
	name: ModuleName;
	collapsed: boolean; // Для UI, чтобы знать, свернут ли модуль
	settings: Setting[];
	isRequired: boolean;
	templateId: string;
}

export interface DefaultModule extends Module {
	name: "Default";
	settings: Setting[];
}

export interface MotionModule extends Module {
	name: "Motion";
	settings: Setting[];
}
