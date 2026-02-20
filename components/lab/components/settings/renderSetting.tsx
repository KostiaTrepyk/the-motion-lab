import { Module } from "@/types/modules";
import { Slider } from "@/components/ui/Slider";
import { EditorSetting } from "@/types/settings";
import { Collapse } from "@/components/ui/Collapse";
import IconButton from "@/components/ui/IconButton";
import { BiSolidHide } from "react-icons/bi";
import { LabContextType } from "@/context/lab.context";

export function renderSetting(
	module: Module,
	setting: EditorSetting,
	changeModuleSetting: LabContextType["changeModuleSetting"],
	toggleSettingDisabled: LabContextType["toggleSettingDisabled"],
): React.JSX.Element {
	function toggleDisabled() {
		toggleSettingDisabled(module.name, setting.id);
	}

	return (
		<div key={setting.id}>
			{setting.canBeDisabled && (
				<IconButton
					variant="outline"
					color="secondary"
					size="small"
					onClick={toggleDisabled}
				>
					{setting.isDisabled ? (
						<BiSolidHide className="w-full" />
					) : (
						""
					)}
				</IconButton>
			)}

			{setting.type === "object" && (
				<Collapse label={setting.label} isCollapsed={module.collapsed}>
					{setting.settings.map((s) =>
						renderSetting(
							module,
							s,
							changeModuleSetting,
							toggleSettingDisabled,
						),
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
