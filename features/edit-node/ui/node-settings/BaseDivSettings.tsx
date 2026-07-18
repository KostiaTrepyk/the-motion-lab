import type { DivNode, MotionDivNode } from "@/entities/node";
import { Setting, SettingsList } from "@/shared/ui";
import { useId } from "react";
import { twMerge } from "tailwind-merge";
import { ALIGN_ICONS, INPUT_STYLES } from "./consts";

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
		<SettingsList label="Base Settings">
			<Setting labelText="Classes (Tailwind)" htmlFor={classNameId}>
				<textarea
					className={twMerge(INPUT_STYLES, "min-h-20 font-mono resize-y")}
					value={node.props.className || ""}
					onChange={handleClassNameChange}
					id={classNameId}
					placeholder="p-4 bg-teal-600 rounded-md..."
				/>
			</Setting>

			<Setting labelText="Text Alignment">
				<div className="flex gap-2" role="group">
					{["clear", "left", "center", "right"].map((align) => {
						const Icon = ALIGN_ICONS[align as keyof typeof ALIGN_ICONS];
						const isActive = activeTextAlign === (align === "clear" ? "auto" : align);

						return (
							<button
								key={align}
								type="button"
								onClick={() => handleAlignText(align as "clear" | "left" | "center" | "right")}
								className={twMerge(
									"flex justify-center items-center border border-transparent rounded w-8 h-8 transition-all duration-200",
									isActive
										? "bg-amber-500/20 text-amber-500 border-amber-500/50"
										: "bg-neutral-800 text-neutral-400 hover:bg-neutral-700 hover:text-neutral-200",
								)}
							>
								<Icon className="w-4 h-4" />
							</button>
						);
					})}
				</div>
			</Setting>

			{additionalSettings}
		</SettingsList>
	);
}
