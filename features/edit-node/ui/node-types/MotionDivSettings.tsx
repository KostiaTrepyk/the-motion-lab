"use client";

import type { MotionDivNode } from "@/entities/node";
import { Collapse } from "@/shared/ui";
import { FiActivity, FiLayout, FiMousePointer, FiMove } from "react-icons/fi";
import { useNodeStyles } from "../../lib/useNodeStyles";
import { BaseStylingSettings } from "../sections/BaseStylingSettings";
import { GesturesSettings } from "../sections/GesturesSettings";
import { MotionTabsSettings } from "../sections/MotionTabsSettings";
import { TransitionSettings } from "../sections/TransitionSettings";

export interface MotionDivSettingsProps {
	node: MotionDivNode;
}

export function MotionDivSettings({ node }: MotionDivSettingsProps) {
	const { updateClassName, handleAlignText } = useNodeStyles(node.id, "motion.div");

	const hasActiveMotion = node.props.initial !== undefined || node.props.animate !== undefined;

	const hasActiveGestures =
		node.props.whileHover !== undefined ||
		node.props.whileTap !== undefined ||
		node.props.whileDrag !== undefined ||
		node.props.whileInView !== undefined;

	const hasActiveTransition = node.props.transition !== undefined;

	return (
		<div className="flex flex-col divide-y divide-neutral-800/60">
			{/* Секция 1: Base / Styling */}
			<Collapse text="Base / Styling" icon={<FiLayout className="w-4 h-4 text-amber-500" />} defaultOpen={true}>
				<div className="px-1 pt-2 pb-3">
					<BaseStylingSettings
						node={node}
						handleClassNameChange={(e) => updateClassName(e.target.value)}
						handleAlignText={(val) => handleAlignText(node.props?.className, val)}
					/>
				</div>
			</Collapse>

			{/* Секция 2: Motion (Основная - Initial, Animate) */}
			<Collapse
				text="Motion (Основная)"
				icon={<FiMove className="w-4 h-4 text-amber-500" />}
				badge={
					<span
						className={`w-2 h-2 rounded-full inline-block transition-colors ${
							hasActiveMotion ? "bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.6)]" : "bg-neutral-600"
						}`}
					/>
				}
				defaultOpen={true}
			>
				<div className="px-1 pt-2 pb-3">
					<MotionTabsSettings node={node} />
				</div>
			</Collapse>

			{/* Секция 3: Gestures (whileHover, whileTap, whileDrag, whileInView) */}
			<Collapse
				text="Gestures"
				icon={<FiMousePointer className="w-4 h-4 text-amber-500" />}
				badge={
					<span
						className={`w-2 h-2 rounded-full inline-block transition-colors ${
							hasActiveGestures
								? "bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.6)]"
								: "bg-neutral-600"
						}`}
					/>
				}
				defaultOpen={false}
			>
				<div className="px-1 pt-2 pb-3">
					<GesturesSettings node={node} />
				</div>
			</Collapse>

			{/* Секция 4: Transition (Магия - Spring, Tween, Inertia) */}
			<Collapse
				text="Transition (Магия)"
				icon={<FiActivity className="w-4 h-4 text-amber-500" />}
				badge={
					<span
						className={`w-2 h-2 rounded-full inline-block transition-colors ${
							hasActiveTransition
								? "bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.6)]"
								: "bg-neutral-600"
						}`}
					/>
				}
				defaultOpen={true}
			>
				<div className="px-1 pt-2 pb-3">
					<TransitionSettings node={node} />
				</div>
			</Collapse>
		</div>
	);
}
