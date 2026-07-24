"use client";

import type { CssPropertyValue, DivNode, MotionDivNode } from "@/entities/node";
import { Input, Setting, SettingsList } from "@/shared/ui";
import React from "react";
import { useNodeStyles } from "../../lib/useNodeStyles";
import { DynamicCssField } from "../components/DynamicCssField";
import { PropertyPicker } from "../components/PropertyPicker";

export interface BaseStylingSettingsProps {
	node: DivNode | MotionDivNode;
	handleClassNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function BaseStylingSettings({ node, handleClassNameChange }: BaseStylingSettingsProps) {
	const { updateStyleProp, removeStyleProp } = useNodeStyles(node.id, node.type);

	const style: Record<string, CssPropertyValue> = (node.props.style as Record<string, CssPropertyValue>) || {};
	const className = node.props.className || "";

	const activeStyleKeys = Object.keys(style);

	const handleAddProperty = (key: string, defaultValue: CssPropertyValue) => {
		updateStyleProp(key as keyof React.CSSProperties, defaultValue);
	};

	const handleRemoveProperty = (key: string) => {
		removeStyleProp(key as keyof React.CSSProperties);
	};

	return (
		<SettingsList>
			{/* Classes Raw Input (Tailwind utilities) */}
			<Setting labelText="Classes (Tailwind)">
				<Input
					type="text"
					value={className}
					onChange={handleClassNameChange}
					placeholder="flex justify-between gap-4..."
				/>
			</Setting>

			{/* Active CSS Style Properties with individual remove button */}
			{activeStyleKeys.length === 0 ? (
				<div className="py-4 text-neutral-500 text-xs text-center italic">
					Нет активных CSS свойств. Нажмите «+ Add Property» ниже.
				</div>
			) : (
				<div className="space-y-2">
					{activeStyleKeys.map((key) => (
						<DynamicCssField
							key={key}
							propKey={key}
							value={style[key]}
							onChange={(val) => updateStyleProp(key as keyof React.CSSProperties, val)}
							onRemove={() => handleRemoveProperty(key)}
						/>
					))}
				</div>
			)}

			{/* PropertyPicker Trigger (+ Add Property / + Custom CSS) */}
			<div className="pt-2 border-neutral-800/60 border-t">
				<PropertyPicker existingKeys={activeStyleKeys} onAddProperty={handleAddProperty} />
			</div>
		</SettingsList>
	);
}
