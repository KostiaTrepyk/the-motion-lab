"use client";

import type { MotionDivNode } from "@/entities/node";
import { labStoreActions, type CssPropertyValue } from "@/entities/node";
import { Tabs } from "@/shared/ui";
import { useState } from "react";
import { DynamicCssField } from "../components/DynamicCssField";
import { PropertyPicker } from "../components/PropertyPicker";

export interface MotionTabsSettingsProps {
	node: MotionDivNode;
}

type MotionTabState = "initial" | "animate";

export function MotionTabsSettings({ node }: MotionTabsSettingsProps) {
	const [activeTab, setActiveTab] = useState<MotionTabState>("animate");

	const isInitialEnabled = node.props.initial !== undefined && node.props.initial !== false;
	const isAnimateEnabled = node.props.animate !== undefined && node.props.animate !== false;

	const isCurrentEnabled = activeTab === "initial" ? isInitialEnabled : isAnimateEnabled;

	const tabItems = [
		{
			id: "initial" as const,
			label: "Initial",
			icon: (
				<span
					className={`w-2 h-2 rounded-full transition-colors ${
						isInitialEnabled ? "bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.6)]" : "bg-neutral-600"
					}`}
				/>
			),
		},
		{
			id: "animate" as const,
			label: "Animate",
			icon: (
				<span
					className={`w-2 h-2 rounded-full transition-colors ${
						isAnimateEnabled ? "bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.6)]" : "bg-neutral-600"
					}`}
				/>
			),
		},
	];

	const toggleTabEnabled = (tab: MotionTabState, enabled: boolean) => {
		if (!enabled) {
			labStoreActions.updateNodeProps(node.id, {
				type: "motion.div",
				props: { [tab]: undefined },
			});
		} else {
			labStoreActions.updateNodeProps(node.id, {
				type: "motion.div",
				props: { [tab]: {} },
			});
		}
	};

	const rawStateProps = node.props[activeTab];
	const targetStateProps: Record<string, CssPropertyValue> =
		typeof rawStateProps === "object" && rawStateProps !== null
			? (rawStateProps as Record<string, CssPropertyValue>)
			: {};

	const activeKeys = Object.keys(targetStateProps);

	const handleUpdateProp = (key: string, value: CssPropertyValue) => {
		if (!isCurrentEnabled) return;
		labStoreActions.updateNodeProps(node.id, {
			type: "motion.div",
			props: {
				[activeTab]: {
					[key]: value,
				},
			},
		});
	};

	const handleRemoveProp = (key: string) => {
		labStoreActions.removeMotionProperty(node.id, activeTab, key);
	};

	const handleAddProperty = (key: string, defaultValue: CssPropertyValue) => {
		if (!isCurrentEnabled) return;
		labStoreActions.updateNodeProps(node.id, {
			type: "motion.div",
			props: {
				[activeTab]: {
					[key]: defaultValue,
				},
			},
		});
	};

	return (
		<div className="flex flex-col gap-3 py-1">
			<Tabs items={tabItems} activeTab={activeTab} onChange={setActiveTab} />

			<div className="flex flex-col gap-3 bg-neutral-900/40 p-2.5 border border-neutral-800/60 rounded-xl">
				{/* Enable/Disable Toggle Switch for Active Tab */}
				<div className="flex justify-between items-center pb-2 border-neutral-800/60 border-b">
					<span className="font-semibold text-neutral-300 text-xs capitalize">Состояние {activeTab}</span>
					<label className="flex items-center gap-2 cursor-pointer select-none">
						<input
							type="checkbox"
							checked={isCurrentEnabled}
							onChange={(e) => toggleTabEnabled(activeTab, e.target.checked)}
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
							Состояние <strong className="text-neutral-300 capitalize">{activeTab}</strong> выключено.
						</span>
						<span className="text-[11px] text-neutral-600">
							Атрибут <code className="font-mono text-amber-400/80">{activeTab}</code> удален из
							компонента.
						</span>
					</div>
				) : (
					<div className="flex flex-col gap-3">
						{activeKeys.length === 0 ? (
							<div className="py-4 text-neutral-500 text-xs text-center italic">
								Нет добавленных CSS свойств. Используйте «+ Add Property» ниже.
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
					</div>
				)}
			</div>
		</div>
	);
}
