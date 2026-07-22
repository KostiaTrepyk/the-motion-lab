"use client";

import type { MotionDivNode } from "@/entities/node";
import { labStoreActions } from "@/entities/node";
import { Setting, Typography } from "@/shared/ui";
import type { ViewportOptions } from "framer-motion";

export interface ViewportControlsProps {
	node: MotionDivNode;
}

export function ViewportControls({ node }: ViewportControlsProps) {
	const currentViewport = (node.props.viewport as ViewportOptions | undefined) || {};
	const currentViewportOnce = currentViewport.once ?? false;
	const currentViewportAmount = (currentViewport.amount as number) ?? 0.5;

	const updateViewport = (updatedViewport: Partial<ViewportOptions>) => {
		labStoreActions.updateNodeProps(node.id, {
			type: "motion.div",
			props: {
				viewport: {
					...currentViewport,
					...updatedViewport,
				},
			},
		});
	};

	return (
		<div className="flex flex-col gap-3 pt-2 border-neutral-800/80 border-t">
			<Typography type="mono" className="font-semibold text-amber-400 text-xs">
				Viewport Settings
			</Typography>

			<Setting labelText="Viewport Once (Один раз)">
				<label className="flex items-center gap-2 text-neutral-300 text-xs cursor-pointer">
					<input
						type="checkbox"
						checked={currentViewportOnce}
						onChange={(e) => updateViewport({ once: e.target.checked })}
						className="rounded accent-amber-500"
					/>
					Анимировать только при первом появлении в кадре
				</label>
			</Setting>

			<Setting labelText="Viewport Amount (Доля экрана)">
				<div className="flex items-center gap-3">
					<input
						type="range"
						min="0.1"
						max="1"
						step="0.1"
						value={currentViewportAmount}
						onChange={(e) => updateViewport({ amount: parseFloat(e.target.value) || 0.5 })}
						className="flex-1 bg-neutral-800 rounded-lg h-1.5 accent-amber-500 appearance-none cursor-pointer"
					/>
					<Typography type="mono" className="w-10 text-neutral-400 text-xs text-right">
						{currentViewportAmount}
					</Typography>
				</div>
			</Setting>
		</div>
	);
}
