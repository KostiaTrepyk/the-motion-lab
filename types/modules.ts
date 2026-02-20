import { EditorSetting } from "./settings";

export type Module = DefaultModule | MotionModule;

export interface BaseModule {
	name: string;
	collapsed: boolean; // Для UI, чтобы знать, свернут ли модуль
	settings: EditorSetting[];
}

export interface DefaultModule extends BaseModule {
	name: "Default";
	settings: EditorSetting[];
}

export interface MotionModule extends BaseModule {
	name: "Motion";
	settings: EditorSetting[];
}
