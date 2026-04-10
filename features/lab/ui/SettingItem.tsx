import { Collapse } from "@/shared/ui/Collapse";
import { IconButton } from "@/shared/ui/IconButton";
import { Slider } from "@/shared/ui/Slider";
import { BiShow, BiSolidHide } from "react-icons/bi";
import { MdDelete } from "react-icons/md";
import { labStoreActions } from "../model/store";
import type { Module } from "../model/types/module";
import type { Setting } from "../model/types/setting";

export interface RenderSettingProps {
	module: Module;
	setting: Setting;
}

export function SettingItem({ module, setting }: RenderSettingProps): React.ReactNode {
	const { changeSettingValue, toggleSettingDisabled, removeSettingById } = labStoreActions;

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
				onClick={() => removeSettingById(module.name, setting.id)}
			>
				<MdDelete className="w-full" />
			</IconButton>

			{setting.type === "object" && (
				<Collapse label={setting.label} isCollapsed={module.collapsed}>
					{setting.settings.map((s) => (
						<SettingItem key={s.id} module={module} setting={s} />
					))}
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

			{setting.type === "component" && (
				<div>
					<div>{setting.label}</div>
					<textarea
						className="border border-neutral-600 rounded w-full"
						onChange={(e) => changeSettingValue(module.name, setting.id, e.target.value)}
						defaultValue={setting.value}
					></textarea>
				</div>
			)}
		</div>
	);
}
