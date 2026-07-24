"use client";

import type { MotionDivNode } from "@/entities/node";
import { labStoreActions, type CssPropertyValue } from "@/entities/node";
import { Tabs } from "@/shared/ui";
import { useState } from "react";
import { DynamicCssField } from "../components/DynamicCssField";
import { PropertyPicker } from "../components/PropertyPicker";
import { DragControls } from "../controls/DragControls";
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
			labStoreActions.updateNodeProps(node.id, {
				type: "motion.div",
				props: {
					[gesture]: {},
					...(gesture === "whileDrag" ? { drag: true } : {}),
				},
			});
		}
	};

	const rawGestureProps = node.props[activeGesture];
	const targetStateProps: Record<string, CssPropertyValue> =
		typeof rawGestureProps === "object" && rawGestureProps !== null
			? (rawGestureProps as Record<string, CssPropertyValue>)
			: {};

	const activeKeys = Object.keys(targetStateProps);

	const handleUpdateProp = (key: string, value: CssPropertyValue) => {
		if (!isCurrentEnabled) return;
		labStoreActions.updateNodeProps(node.id, {
			type: "motion.div",
			props: {
				[activeGesture]: {
					[key]: value,
				},
			},
		});
	};

	const handleRemoveProp = (key: string) => {
		labStoreActions.removeMotionProperty(node.id, activeGesture, key);
	};

	const handleAddProperty = (key: string, defaultValue: CssPropertyValue) => {
		if (!isCurrentEnabled) return;
		labStoreActions.updateNodeProps(node.id, {
			type: "motion.div",
			props: {
				[activeGesture]: {
					[key]: defaultValue,
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
					<div className="flex flex-col gap-3">
						{activeKeys.length === 0 ? (
							<div className="py-4 text-neutral-500 text-xs text-center italic">
								Нет свойств анимации для этого жеста. Добавьте свойства через «+ Add Property».
							</div>
						) : (
							<div className="space-y-2">
								{activeKeys.map((key) => (
									<DynamicCssField
										key={key}
										propKey={key}
										value={targetStateProps[key]}
										onChange={(val) => handleUpdateProp(key, val)}
										onRemove={() => handleRemoveProp(key)}
									/>
								))}
							</div>
						)}

						<div className="pt-1 border-neutral-800/60 border-t">
							<PropertyPicker existingKeys={activeKeys} onAddProperty={handleAddProperty} />
						</div>

						{/* Drag specific controls */}
						{activeGesture === "whileDrag" && <DragControls node={node} />}

						{/* InView specific controls */}
						{activeGesture === "whileInView" && <ViewportControls node={node} />}
					</div>
				)}
			</div>
		</div>
	);
}
