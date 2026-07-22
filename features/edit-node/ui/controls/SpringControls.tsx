"use client";

import { Setting, Typography } from "@/shared/ui";
import { INPUT_STYLES } from "./consts";

export interface SpringConfig {
	stiffness?: number;
	damping?: number;
	mass?: number;
	bounce?: number;
}

interface SpringControlsProps {
	config: SpringConfig;
	onChange: (updated: SpringConfig) => void;
}

export function SpringControls({ config, onChange }: SpringControlsProps) {
	const stiffness = config.stiffness ?? 100;
	const damping = config.damping ?? 10;
	const mass = config.mass ?? 1;
	const bounce = config.bounce ?? 0;

	return (
		<div className="flex flex-col gap-3 bg-neutral-950/60 p-3 border border-neutral-800/80 rounded-xl">
			{/* Stiffness */}
			<Setting labelText="Stiffness (Жесткость)">
				<div className="flex items-center gap-3">
					<input
						type="range"
						min="1"
						max="800"
						step="5"
						value={stiffness}
						onChange={(e) => onChange({ ...config, stiffness: parseFloat(e.target.value) || 100 })}
						className="flex-1 bg-neutral-800 rounded-lg h-1.5 accent-amber-500 appearance-none cursor-pointer"
					/>
					<input
						type="number"
						value={stiffness}
						onChange={(e) => onChange({ ...config, stiffness: parseFloat(e.target.value) || 100 })}
						className={`${INPUT_STYLES} w-16 text-center`}
					/>
				</div>
			</Setting>

			{/* Damping */}
			<Setting labelText="Damping (Затухание)">
				<div className="flex items-center gap-3">
					<input
						type="range"
						min="0"
						max="100"
						step="1"
						value={damping}
						onChange={(e) => onChange({ ...config, damping: parseFloat(e.target.value) || 0 })}
						className="flex-1 bg-neutral-800 rounded-lg h-1.5 accent-amber-500 appearance-none cursor-pointer"
					/>
					<input
						type="number"
						value={damping}
						onChange={(e) => onChange({ ...config, damping: parseFloat(e.target.value) || 0 })}
						className={`${INPUT_STYLES} w-16 text-center`}
					/>
				</div>
			</Setting>

			{/* Mass */}
			<Setting labelText="Mass (Масса)">
				<div className="flex items-center gap-3">
					<input
						type="range"
						min="0.1"
						max="10"
						step="0.1"
						value={mass}
						onChange={(e) => onChange({ ...config, mass: parseFloat(e.target.value) || 1 })}
						className="flex-1 bg-neutral-800 rounded-lg h-1.5 accent-amber-500 appearance-none cursor-pointer"
					/>
					<input
						type="number"
						step="0.1"
						value={mass}
						onChange={(e) => onChange({ ...config, mass: parseFloat(e.target.value) || 1 })}
						className={`${INPUT_STYLES} w-16 text-center`}
					/>
				</div>
			</Setting>

			{/* Bounce */}
			<Setting labelText="Bounce (Отскок)">
				<div className="flex items-center gap-3">
					<input
						type="range"
						min="0"
						max="1"
						step="0.05"
						value={bounce}
						onChange={(e) => onChange({ ...config, bounce: parseFloat(e.target.value) || 0 })}
						className="flex-1 bg-neutral-800 rounded-lg h-1.5 accent-amber-500 appearance-none cursor-pointer"
					/>
					<Typography type="mono" className="w-12 text-neutral-400 text-xs text-right">
						{bounce}
					</Typography>
				</div>
			</Setting>
		</div>
	);
}
