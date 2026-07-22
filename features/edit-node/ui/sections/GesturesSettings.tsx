"use client";

import type { MotionDivNode } from "@/entities/node";
import { labStoreActions } from "@/entities/node";
import { Tabs } from "@/shared/ui";
import type { TargetAndTransition } from "framer-motion";
import { useState } from "react";
import { DragControls } from "../controls/DragControls";
import { TransformControls } from "../controls/TransformControls";
import { ViewportControls } from "../controls/ViewportControls";

export interface GesturesSettingsProps {
	node: MotionDivNode;
}

type GestureTabState = "whileHover" | "whileTap" | "whileDrag" | "whileInView";

export function GesturesSettings({ node }: GesturesSettingsProps) {
	const [activeGesture, setActiveGesture] = useState<GestureTabState>("whileHover");

	const isHoverEnabled = node.props.whileHover !== undefined;
	const isTapEnabled = node.props.whileTap !== undefined;
	const isDragEnabled = node.props.whileDrag !== undefined;
	const isInViewEnabled = node.props.whileInView !== undefined;

	const isCurrentEnabled =
		activeGesture === "whileHover"
			? isHoverEnabled
			: activeGesture === "whileTap"
				? isTapEnabled
				: activeGesture === "whileDrag"
					? isDragEnabled
					: isInViewEnabled;

	const gestureTabs = [
		{
			id: "whileHover" as const,
			label: "Hover",
			icon: (
				<span
					className={`w-2 h-2 rounded-full transition-colors ${
						isHoverEnabled ? "bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.6)]" : "bg-neutral-600"
					}`}
				/>
			),
		},
		{
			id: "whileTap" as const,
			label: "Tap",
			icon: (
				<span
					className={`w-2 h-2 rounded-full transition-colors ${
						isTapEnabled ? "bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.6)]" : "bg-neutral-600"
					}`}
				/>
			),
		},
		{
			id: "whileDrag" as const,
			label: "Drag",
			icon: (
				<span
					className={`w-2 h-2 rounded-full transition-colors ${
						isDragEnabled ? "bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.6)]" : "bg-neutral-600"
					}`}
				/>
			),
		},
		{
			id: "whileInView" as const,
			label: "InView",
			icon: (
				<span
					className={`w-2 h-2 rounded-full transition-colors ${
						isInViewEnabled ? "bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.6)]" : "bg-neutral-600"
					}`}
				/>
			),
		},
	];

	const toggleGestureEnabled = (gesture: GestureTabState, enabled: boolean) => {
		if (!enabled) {
			labStoreActions.updateNodeProps(node.id, {
				type: "motion.div",
				props: {
					[gesture]: undefined,
					...(gesture === "whileDrag" ? { drag: false } : {}),
				},
			});
		} else {
			const defaultObj: TargetAndTransition =
				gesture === "whileHover"
					? { scale: 1.05 }
					: gesture === "whileTap"
						? { scale: 0.95 }
						: gesture === "whileDrag"
							? { scale: 1.02 }
							: { opacity: 1 };

			labStoreActions.updateNodeProps(node.id, {
				type: "motion.div",
				props: {
					[gesture]: defaultObj,
					...(gesture === "whileDrag" ? { drag: true } : {}),
				},
			});
		}
	};

	const targetProps = (node.props[activeGesture] as TargetAndTransition | undefined) || {};

	const updateGestureProp = (property: string, value: number) => {
		if (!isCurrentEnabled) return;
		labStoreActions.updateNodeProps(node.id, {
			type: "motion.div",
			props: {
				[activeGesture]: {
					[property]: value,
				},
			},
		});
	};

	return (
		<div className="flex flex-col gap-3 py-1">
			<Tabs items={gestureTabs} activeTab={activeGesture} onChange={setActiveGesture} />

			<div className="flex flex-col gap-3 bg-neutral-900/40 p-2.5 border border-neutral-800/60 rounded-xl">
				{/* Enable/Disable Toggle Switch for Active Gesture */}
				<div className="flex justify-between items-center pb-2 border-neutral-800/60 border-b">
					<span className="font-mono font-semibold text-neutral-300 text-xs">{activeGesture}</span>
					<label className="flex items-center gap-2 cursor-pointer select-none">
						<input
							type="checkbox"
							checked={isCurrentEnabled}
							onChange={(e) => toggleGestureEnabled(activeGesture, e.target.checked)}
							className="rounded w-4 h-4 accent-amber-500 cursor-pointer"
						/>
						<span
							className={`text-xs font-medium ${
								isCurrentEnabled ? "text-amber-400 font-semibold" : "text-neutral-500"
							}`}
						>
							{isCurrentEnabled ? "Включено" : "Выключено"}
						</span>
					</label>
				</div>

				{!isCurrentEnabled ? (
					<div className="flex flex-col items-center gap-1 bg-neutral-950/40 px-3 py-6 border border-neutral-800/40 rounded-lg text-neutral-500 text-xs text-center">
						<span>
							Жест <strong className="font-mono text-neutral-300">{activeGesture}</strong> выключен.
						</span>
						<span className="text-[11px] text-neutral-600">
							Атрибут <code className="font-mono text-amber-400/80">{activeGesture}</code> удален из
							компонента.
						</span>
					</div>
				) : (
					<>
						<TransformControls targetProps={targetProps} onChange={updateGestureProp} />

						{/* Drag specific controls */}
						{activeGesture === "whileDrag" && <DragControls node={node} />}

						{/* InView specific controls */}
						{activeGesture === "whileInView" && <ViewportControls node={node} />}
					</>
				)}
			</div>
		</div>
	);
}
