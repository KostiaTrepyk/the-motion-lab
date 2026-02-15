import { twMerge } from "tailwind-merge";
import { renderSetting } from "./renderSetting";
import { Module } from "@/types/modules";

export interface SettingsProps extends React.HTMLAttributes<HTMLDivElement> {
	modules: Module[];
	removeModule: (moduleName: string) => void;
	changeModuleSetting: (
		moduleName: string,
		settingId: string,
		value: number | string,
	) => void;
}

export default function Settings({
	modules,
	removeModule,
	changeModuleSetting,
	...rest
}: SettingsProps) {
	return (
		<div {...rest} className={twMerge(rest.className, "p-4")}>
			{modules.map((module) => (
				<div key={module.name}>
					<div className="font-bold text-lg">{module.name}</div>
					{module.name !== "Default" && (
						<button onClick={() => removeModule(module.name)}>
							-
						</button>
					)}
					{module.settings.map((setting) =>
						renderSetting(module, setting, changeModuleSetting),
					)}
				</div>
			))}
		</div>
	);
}
