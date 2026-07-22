"use client";

import React from "react";
import type { MotionDivNode } from "@/entities/node";
import { labStoreActions } from "@/entities/node";
import { Setting, Tabs } from "@/shared/ui";
import type { Transition } from "framer-motion";
import { CubicBezierEditor, type CubicBezierArray } from "../controls/CubicBezierEditor";
import { SpringControls, type SpringConfig } from "../controls/SpringControls";
import { INPUT_STYLES } from "../controls/consts";

export interface TransitionSettingsProps {
	node: MotionDivNode;
}

type TransitionType = "spring" | "tween";

export function TransitionSettings({ node }: TransitionSettingsProps) {
	const isTransitionEnabled = node.props.transition !== undefined;

	const currentTransition = (node.props.transition as Transition | undefined) || {};

	const transitionType: TransitionType =
		(currentTransition.type as TransitionType) === "tween" ? "tween" : "spring";

	const typeTabs = [
		{ id: "spring" as const, label: "Spring (Пружина)" },
		{ id: "tween" as const, label: "Tween (Кривые)" },
	];

	const toggleTransitionEnabled = (enabled: boolean) => {
		if (!enabled) {
			labStoreActions.updateNodeProps(node.id, {
				type: "motion.div",
				props: { transition: undefined },
			});
		} else {
			labStoreActions.updateNodeProps(node.id, {
				type: "motion.div",
				props: {
					transition: { type: "spring", stiffness: 100, damping: 10, mass: 1 },
				},
			});
		}
	};

	const handleTypeChange = (newType: TransitionType) => {
		if (!isTransitionEnabled) return;
		let defaultProps: Transition = { type: newType };
		if (newType === "spring") {
			defaultProps = { type: "spring", stiffness: 100, damping: 10, mass: 1 };
		} else if (newType === "tween") {
			defaultProps = { type: "tween", duration: 0.5, ease: [0.25, 0.1, 0.25, 1.0] };
		}

		labStoreActions.updateNodeProps(node.id, {
			type: "motion.div",
			props: {
				transition: defaultProps,
			},
		});
	};

	const updateTransitionProp = (props: Record<string, unknown> | SpringConfig) => {
		if (!isTransitionEnabled) return;
		labStoreActions.updateNodeProps(node.id, {
			type: "motion.div",
			props: {
				transition: {
					...currentTransition,
					...props,
				},
			},
		});
	};

	const duration = typeof currentTransition.duration === "number" ? currentTransition.duration : 0.5;
	const delay = typeof currentTransition.delay === "number" ? currentTransition.delay : 0;

	return (
		<div className="flex flex-col gap-3 py-1">
			{/* Enable/Disable Toggle Switch for Transition */}
			<div className="flex items-center justify-between p-2.5 bg-neutral-900/40 rounded-xl border border-neutral-800/60">
				<span className="text-xs font-semibold text-neutral-300">
					Настройка перехода (Transition)
				</span>
				<label className="flex items-center gap-2 cursor-pointer select-none">
					<input
						type="checkbox"
						checked={isTransitionEnabled}
						onChange={(e) => toggleTransitionEnabled(e.target.checked)}
						className="accent-amber-500 rounded cursor-pointer w-4 h-4"
					/>
					<span
						className={`text-xs font-medium ${
							isTransitionEnabled ? "text-amber-400 font-semibold" : "text-neutral-500"
						}`}
					>
						{isTransitionEnabled ? "Включено" : "Выключено"}
					</span>
				</label>
			</div>

			{!isTransitionEnabled ? (
				<div className="py-6 px-3 text-center text-xs text-neutral-500 bg-neutral-950/40 rounded-lg border border-neutral-800/40 flex flex-col items-center gap-1">
					<span>
						Настройка <strong className="text-neutral-300 font-mono">Transition</strong> выключена.
					</span>
					<span className="text-neutral-600 text-[11px]">
						Атрибут <code className="text-amber-400/80 font-mono">transition</code> удален из компонента.
					</span>
				</div>
			) : (
				<>
					{/* Transition Type Tabs */}
					<Tabs items={typeTabs} activeTab={transitionType} onChange={handleTypeChange} />

					{/* Global Timing: Duration and Delay */}
					<div className="grid grid-cols-2 gap-2 bg-neutral-900/40 p-2.5 rounded-xl border border-neutral-800/60">
						<Setting labelText="Duration (сек)">
							<input
								type="number"
								step="0.1"
								min="0"
								value={duration}
								onChange={(e) => updateTransitionProp({ duration: parseFloat(e.target.value) || 0 })}
								className={INPUT_STYLES}
							/>
						</Setting>

						<Setting labelText="Delay (задержка сек)">
							<input
								type="number"
								step="0.1"
								min="0"
								value={delay}
								onChange={(e) => updateTransitionProp({ delay: parseFloat(e.target.value) || 0 })}
								className={INPUT_STYLES}
							/>
						</Setting>
					</div>

					{/* Dynamic Controls based on Transition Type */}
					{transitionType === "spring" && (
						<SpringControls
							config={{
								stiffness: currentTransition.stiffness,
								damping: currentTransition.damping,
								mass: currentTransition.mass,
								bounce: currentTransition.bounce,
							}}
							onChange={(springConfig) => updateTransitionProp(springConfig)}
						/>
					)}

					{transitionType === "tween" && (
						<CubicBezierEditor
							value={currentTransition.ease as CubicBezierArray | string}
							onChange={(bezierArray) => updateTransitionProp({ ease: bezierArray })}
						/>
					)}
				</>
			)}
		</div>
	);
}
