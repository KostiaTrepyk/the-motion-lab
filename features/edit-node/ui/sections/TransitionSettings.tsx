"use client";

import type { MotionDivNode } from "@/entities/node";
import { labStoreActions } from "@/entities/node";
import { Input, Setting, Tabs } from "@/shared/ui";
import type { Transition } from "framer-motion";
import { CubicBezierEditor, type CubicBezierArray } from "../controls/CubicBezierEditor";
import { SpringControls, type SpringConfig } from "../controls/SpringControls";

export interface TransitionSettingsProps {
	node: MotionDivNode;
}

type TransitionType = "spring" | "tween";

export function TransitionSettings({ node }: TransitionSettingsProps) {
	const isTransitionEnabled = node.props.transition !== undefined;

	const currentTransition = (node.props.transition as Transition | undefined) || {};

	const transitionType: TransitionType = (currentTransition.type as TransitionType) === "tween" ? "tween" : "spring";

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
					transition: {},
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
			<div className="flex justify-between items-center bg-neutral-900/40 p-2.5 border border-neutral-800/60 rounded-xl">
				<span className="font-semibold text-neutral-300 text-xs">Настройка перехода (Transition)</span>
				<label className="flex items-center gap-2 cursor-pointer select-none">
					<input
						type="checkbox"
						checked={isTransitionEnabled}
						onChange={(e) => toggleTransitionEnabled(e.target.checked)}
						className="rounded w-4 h-4 accent-amber-500 cursor-pointer"
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
				<div className="flex flex-col items-center gap-1 bg-neutral-950/40 px-3 py-6 border border-neutral-800/40 rounded-lg text-neutral-500 text-xs text-center">
					<span>
						Настройка <strong className="font-mono text-neutral-300">Transition</strong> выключена.
					</span>
					<span className="text-[11px] text-neutral-600">
						Атрибут <code className="font-mono text-amber-400/80">transition</code> удален из компонента.
					</span>
				</div>
			) : (
				<>
					{/* Transition Type Tabs */}
					<Tabs items={typeTabs} activeTab={transitionType} onChange={handleTypeChange} />

					{/* Global Timing: Duration and Delay */}
					<div className="gap-2 grid grid-cols-2 bg-neutral-900/40 p-2.5 border border-neutral-800/60 rounded-xl">
						<Setting labelText="Duration (сек)">
							<Input
								type="number"
								step="0.1"
								min="0"
								value={duration}
								onChange={(e) => updateTransitionProp({ duration: parseFloat(e.target.value) || 0 })}
							/>
						</Setting>

						<Setting labelText="Delay (задержка сек)">
							<Input
								type="number"
								step="0.1"
								min="0"
								value={delay}
								onChange={(e) => updateTransitionProp({ delay: parseFloat(e.target.value) || 0 })}
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
