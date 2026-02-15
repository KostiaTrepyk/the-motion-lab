import { Module } from "@/types/modules";
import { SettingsProps } from "./Settings";
import { Slider } from "@/components/ui/Slider";
import { EditorSetting } from "@/types/settings";

export function renderSetting(
	module: Module,
	setting: EditorSetting,
	changeModuleSetting: SettingsProps["changeModuleSetting"],
): React.JSX.Element {
	return (
		<div key={setting.id}>
			<div className="">
				{setting.label} {setting.type === "object" && ":"}
			</div>
			{setting.type === "object" &&
				setting.settings.map((s) =>
					renderSetting(module, s, changeModuleSetting),
				)}
			{setting.type === "slider" && (
				<Slider
					setting={setting}
					changeModuleSetting={(value) =>
						changeModuleSetting(module.name, setting.id, value)
					}
				/>
			)}
			{setting.type === "text" && (
				<input
					name={setting.label}
					className="px-2 py-1.5 border border-slate-600 rounded-lg text-slate-400"
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
			)}

			{setting.type === "select" && (
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
			)}
		</div>
	);
}
