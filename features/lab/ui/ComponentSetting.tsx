import { labStoreActions } from "../model/store";
import type { Module } from "../model/types/module";
import type { ComponentSetting } from "../model/types/setting";

export interface ComponentSettingProps {
	module: Module;
	setting: ComponentSetting;
}

export function ComponentSetting({ module, setting }: ComponentSettingProps) {
	const { changeSettingValue } = labStoreActions;

	return (
		<div>
			<div>{setting.label}</div>
			<textarea
				className="border border-neutral-600 rounded w-full"
				onChange={(e) => changeSettingValue(module.name, setting.id, e.target.value)}
				defaultValue={setting.value}
			></textarea>
		</div>
	);
}
