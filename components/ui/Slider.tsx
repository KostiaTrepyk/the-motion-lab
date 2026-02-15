import { SliderSetting } from "../lab/Lab";

export interface SliderProps {
	setting: SliderSetting;
	changeModuleSetting: (value: number) => void;
}

export function Slider({ setting, changeModuleSetting }: SliderProps) {
	return (
		<input
			type="range"
			name={setting.label}
			min={setting.min}
			max={setting.max}
			step={setting.step || 0.01}
			value={setting.value}
			onChange={(e) => changeModuleSetting(parseFloat(e.target.value))}
		/>
	);
}
