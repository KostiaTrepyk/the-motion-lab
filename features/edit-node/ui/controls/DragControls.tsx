"use client";

import type { MotionDivNode } from "@/entities/node";
import { labStoreActions } from "@/entities/node";
import { Select, Setting, Typography } from "@/shared/ui";

export interface DragControlsProps {
	node: MotionDivNode;
}

export function DragControls({ node }: DragControlsProps) {
	const currentDrag = node.props.drag ?? false;
	const currentDragElastic = (node.props.dragElastic as number) ?? 0.5;

	const updateDragAxis = (axisValue: "none" | "both" | "x" | "y") => {
		let val: boolean | "x" | "y" = false;
		if (axisValue === "both") val = true;
		if (axisValue === "x") val = "x";
		if (axisValue === "y") val = "y";

		labStoreActions.updateNodeProps(node.id, {
			type: "motion.div",
			props: { drag: val },
		});
	};

	return (
		<div className="flex flex-col gap-3 pt-2 border-neutral-800/80 border-t">
			<Typography type="mono" className="font-semibold text-amber-400 text-xs">
				Drag Settings
			</Typography>

			<Setting labelText="Drag Axis (Оси перетаскивания)">
				<Select
					value={
						currentDrag === true ? "both" : currentDrag === "x" ? "x" : currentDrag === "y" ? "y" : "none"
					}
					onChange={(e) => updateDragAxis(e.target.value as "none" | "both" | "x" | "y")}
				>
					<option value="none">Disabled (отключено)</option>
					<option value="both">Both (X & Y)</option>
					<option value="x">X Axis Only</option>
					<option value="y">Y Axis Only</option>
				</Select>
			</Setting>

			<Setting labelText="Drag Elastic (Упругость)">
				<input
					type="range"
					min="0"
					max="1"
					step="0.05"
					value={currentDragElastic}
					onChange={(e) =>
						labStoreActions.updateNodeProps(node.id, {
							type: "motion.div",
							props: { dragElastic: parseFloat(e.target.value) || 0 },
						})
					}
					className="bg-neutral-800 rounded-lg w-full h-1.5 accent-amber-500 appearance-none cursor-pointer"
				/>
			</Setting>
		</div>
	);
}
