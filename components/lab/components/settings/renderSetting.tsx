import { Module } from "@/types/modules";
import { SettingsProps } from "./Settings";
import { Slider } from "@/components/ui/Slider";
import { EditorSetting } from "@/types/settings";
import { Collapse } from "@/components/ui/Collapse";

export function renderSetting(
	module: Module,
	setting: EditorSetting,
	changeModuleSetting: SettingsProps["changeModuleSetting"],
): React.JSX.Element {
	return (
		<div key={setting.id}>
			{setting.type === "object" && (
				<Collapse label={setting.label} isCollapsed={module.collapsed}>
					{setting.settings.map((s) =>
						renderSetting(module, s, changeModuleSetting),
					)}
				</Collapse>
			)}

			{setting.type === "slider" && (
				<div>
					<div>{setting.label}</div>
					<Slider
						className="w-full"
						setting={setting}
						changeModuleSetting={(value) =>
							changeModuleSetting(module.name, setting.id, value)
						}
					/>
				</div>
			)}

			{setting.type === "text" && (
				<div>
					<div>{setting.label}</div>
					<input
						name={setting.label}
						className="px-2 py-1.5 border border-slate-600 rounded-lg w-full text-slate-400"
						value={setting.value}
						type="text"
						onChange={(e) =>
							changeModuleSetting(
								module.name,
								setting.id,
								e.target.value,
							)
						}
					/>
				</div>
			)}

			{setting.type === "select" && (
				<div>
					<div>{setting.label}</div>
					<select
						value={setting.value}
						onChange={(e) =>
							changeModuleSetting(
								module.name,
								setting.id,
								e.target.value,
							)
						}
					>
						{setting.options?.map((option) => (
							<option key={option} value={option}>
								{option}
							</option>
						))}
					</select>
				</div>
			)}
		</div>
	);
}
