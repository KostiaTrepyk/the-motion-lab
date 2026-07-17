import type { DivNode, MotionDivNode } from "@/entities/node";
import { Setting } from "@/shared/ui/settings-layout/Setting";
import { SettingsList } from "@/shared/ui/settings-layout/SettingsList";
import { useId } from "react";
import { GrClear } from "react-icons/gr";
import { RxTextAlignCenter, RxTextAlignLeft, RxTextAlignRight } from "react-icons/rx";
import { twMerge } from "tailwind-merge";

export interface BaseDivSettingsProps {
	node: DivNode | MotionDivNode;
	handleClassNameChange(e: React.ChangeEvent<HTMLTextAreaElement>): void;
	handleAlignText(value: "left" | "center" | "right" | "clear"): void;
	additionalSettings?: React.ReactNode; // Optional prop for additional settings
}

export function BaseDivSettings({
	node,
	handleClassNameChange,
	handleAlignText,
	additionalSettings,
}: BaseDivSettingsProps) {
	const activeTextAlign = node.props?.className?.match(/text-(left|center|right)/)?.[0]?.split("-")[1] || "auto";

	const classNameId = useId();

	return (
		<SettingsList>
			<Setting labelText="Classes (Tailwind)" htmlFor={classNameId}>
				<textarea
					className="bg-neutral-900 p-2 border border-neutral-700 focus:border-amber-500 rounded outline-none min-h-20 font-mono text-white text-sm"
					value={node.props.className || ""}
					onChange={handleClassNameChange}
					id={classNameId}
				/>
			</Setting>

			<Setting labelText="Text Alignment">
				<div className="flex gap-2" role="group" aria-label="Text Alignment">
					<button
						className={twMerge(
							"bg-neutral-500 hover:bg-amber-600 rounded w-8 aspect-square text-black transition-colors duration-300",
							activeTextAlign === "auto" && "bg-amber-500",
						)}
						onClick={() => handleAlignText("clear")}
						aria-label="Clear alignment"
						type="button"
					>
						<GrClear className="p-1.5 w-full h-full" />
					</button>

					<button
						className={twMerge(
							"bg-neutral-500 hover:bg-amber-600 rounded w-8 aspect-square text-black transition-colors duration-300",
							activeTextAlign === "left" && "bg-amber-500",
						)}
						onClick={() => handleAlignText("left")}
						aria-label="Align left"
						type="button"
					>
						<RxTextAlignLeft className="p-1 w-full h-full" />
					</button>

					<button
						className={twMerge(
							"bg-neutral-500 hover:bg-amber-600 rounded w-8 aspect-square text-black transition-colors duration-300",
							activeTextAlign === "center" && "bg-amber-500",
						)}
						onClick={() => handleAlignText("center")}
						aria-label="Align center"
						type="button"
					>
						<RxTextAlignCenter className="p-1 w-full h-full" />
					</button>

					<button
						className={twMerge(
							"bg-neutral-500 hover:bg-amber-600 rounded w-8 aspect-square text-black transition-colors duration-300",
							activeTextAlign === "right" && "bg-amber-500",
						)}
						onClick={() => handleAlignText("right")}
						aria-label="Align right"
						type="button"
					>
						<RxTextAlignRight className="p-1 w-full h-full" />
					</button>
				</div>
			</Setting>

			{additionalSettings}
		</SettingsList>
	);
}
