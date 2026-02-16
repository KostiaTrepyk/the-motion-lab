import { SliderSetting } from "@/types/settings";

export interface SliderProps extends Omit<
	React.HTMLAttributes<HTMLInputElement>,
	"type" | "name" | "min" | "max" | "step" | "value" | "list" | "onChange"
> {
	setting: SliderSetting;
	changeModuleSetting: (value: number) => void;
}

export function Slider({ setting, changeModuleSetting, ...rest }: SliderProps) {
	return (
		<>
			<input
				{...rest}
				type="range"
				name={setting.label}
				min={setting.min}
				max={setting.max}
				step={setting.step || 0.025}
				value={setting.value}
				list={setting.markers ? setting.id + "-markers" : ""}
				onChange={(e) =>
					changeModuleSetting(parseFloat(e.target.value))
				}
			/>

			{setting.markers && (
				<datalist id={setting.id + "-markers"}>
					{setting.markers.map((marker) => (
						<option
							value={marker}
							key={setting.id + String(marker)}
						></option>
					))}
				</datalist>
			)}
		</>
	);
}
