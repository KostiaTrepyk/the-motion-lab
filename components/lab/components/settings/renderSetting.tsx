import { Collapse } from "@/components/ui/Collapse";
import IconButton from "@/components/ui/IconButton";
import { Slider } from "@/components/ui/Slider";
import { LabSliceActions } from "@/store/slices/lab/labActions";
import { Module } from "@/types/modules";
import { Setting } from "@/types/settings";
import { BiShow, BiSolidHide } from "react-icons/bi";
import { MdDelete } from "react-icons/md";

export function renderSetting(
	module: Module,
	setting: Setting,
	changeSettingValue: LabSliceActions["changeSettingValue"],
	toggleSettingDisabled: LabSliceActions["toggleSettingDisabled"],
	removeSetting: LabSliceActions["removeSettingById"],
): React.ReactNode {
	function toggleDisabled() {
		toggleSettingDisabled(module.name, setting.id);
	}

	return (
		<div key={setting.id}>
			{setting.canBeDisabled && (
				<IconButton variant="outline" color="secondary" size="small" onClick={toggleDisabled}>
					{setting.isDisabled ? <BiSolidHide className="w-full" /> : <BiShow className="w-full" />}
				</IconButton>
			)}

			<IconButton
				variant="outline"
				color="secondary"
				size="small"
				onClick={() => removeSetting(module.name, setting.id)}
			>
				<MdDelete className="w-full" />
			</IconButton>

			{setting.type === "object" && (
				<Collapse label={setting.label} isCollapsed={module.collapsed}>
					{setting.settings.map((s) =>
						renderSetting(module, s, changeSettingValue, toggleSettingDisabled, removeSetting),
					)}
				</Collapse>
			)}

			{setting.type === "slider" && (
				<div>
					<div>{setting.label}</div>
					<Slider
						className="w-full"
						setting={setting}
						changeModuleSetting={(value) => changeSettingValue(module.name, setting.id, value)}
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
						onChange={(e) => changeSettingValue(module.name, setting.id, e.target.value)}
					/>
				</div>
			)}

			{setting.type === "select" && (
				<div>
					<div>{setting.label}</div>
					<select
						value={setting.value}
						onChange={(e) => changeSettingValue(module.name, setting.id, e.target.value)}
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
