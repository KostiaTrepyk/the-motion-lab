import { EditorSetting } from "./settings";

export type Module = DefaultModule | MotionModule;

export interface DefaultModule {
	name: "Default";
	settings: EditorSetting[];
}

export interface MotionModule {
	name: "Motion";
	settings: EditorSetting[];
}
