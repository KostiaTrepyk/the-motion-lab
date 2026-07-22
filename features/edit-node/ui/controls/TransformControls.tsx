"use client";

import { Setting, Typography } from "@/shared/ui";
import type { TargetAndTransition } from "framer-motion";
import { INPUT_STYLES } from "./consts";

export interface TransformControlsProps {
	targetProps: TargetAndTransition;
	onChange: (property: string, value: number) => void;
	defaultOpacity?: number;
}

export function TransformControls({ targetProps, onChange, defaultOpacity = 1 }: TransformControlsProps) {
	const opacity = (targetProps.opacity as number) ?? defaultOpacity;
	const scale = (targetProps.scale as number) ?? 1;
	const x = (targetProps.x as number) ?? 0;
	const y = (targetProps.y as number) ?? 0;
	const rotate = (targetProps.rotate as number) ?? 0;
	const skewX = (targetProps.skewX as number) ?? 0;
	const skewY = (targetProps.skewY as number) ?? 0;

	return (
		<div className="flex flex-col gap-3">
			{/* Opacity Slider */}
			<Setting labelText="Opacity (Прозрачность)">
				<div className="flex items-center gap-3">
					<input
						type="range"
						min="0"
						max="1"
						step="0.05"
						value={opacity}
						onChange={(e) => onChange("opacity", parseFloat(e.target.value) || 0)}
						className="flex-1 bg-neutral-800 rounded-lg h-1.5 accent-amber-500 appearance-none cursor-pointer"
					/>
					<Typography type="mono" className="w-10 text-neutral-400 text-xs text-right">
						{opacity}
					</Typography>
				</div>
			</Setting>

			{/* Scale Slider */}
			<Setting labelText="Scale (Масштаб)">
				<div className="flex items-center gap-3">
					<input
						type="range"
						min="0"
						max="2.5"
						step="0.05"
						value={scale}
						onChange={(e) => onChange("scale", parseFloat(e.target.value) || 0)}
						className="flex-1 bg-neutral-800 rounded-lg h-1.5 accent-amber-500 appearance-none cursor-pointer"
					/>
					<input
						type="number"
						step="0.05"
						value={scale}
						onChange={(e) => onChange("scale", parseFloat(e.target.value) || 0)}
						className={`${INPUT_STYLES} w-16 text-center`}
					/>
				</div>
			</Setting>

			{/* X and Y Offsets */}
			<div className="gap-2 grid grid-cols-2">
				<Setting labelText="Position X (px)">
					<input
						type="number"
						value={x}
						onChange={(e) => onChange("x", parseFloat(e.target.value) || 0)}
						className={INPUT_STYLES}
						placeholder="0"
					/>
				</Setting>

				<Setting labelText="Position Y (px)">
					<input
						type="number"
						value={y}
						onChange={(e) => onChange("y", parseFloat(e.target.value) || 0)}
						className={INPUT_STYLES}
						placeholder="0"
					/>
				</Setting>
			</div>

			{/* Rotate */}
			<Setting labelText="Rotate (Градусы °)">
				<div className="flex items-center gap-3">
					<input
						type="range"
						min="-360"
						max="360"
						step="5"
						value={rotate}
						onChange={(e) => onChange("rotate", parseFloat(e.target.value) || 0)}
						className="flex-1 bg-neutral-800 rounded-lg h-1.5 accent-amber-500 appearance-none cursor-pointer"
					/>
					<input
						type="number"
						value={rotate}
						onChange={(e) => onChange("rotate", parseFloat(e.target.value) || 0)}
						className={`${INPUT_STYLES} w-16 text-center`}
					/>
				</div>
			</Setting>

			{/* Skew X and Skew Y */}
			<div className="gap-2 grid grid-cols-2">
				<Setting labelText="Skew X (°)">
					<input
						type="number"
						value={skewX}
						onChange={(e) => onChange("skewX", parseFloat(e.target.value) || 0)}
						className={INPUT_STYLES}
						placeholder="0"
					/>
				</Setting>

				<Setting labelText="Skew Y (°)">
					<input
						type="number"
						value={skewY}
						onChange={(e) => onChange("skewY", parseFloat(e.target.value) || 0)}
						className={INPUT_STYLES}
						placeholder="0"
					/>
				</Setting>
			</div>
		</div>
	);
}
