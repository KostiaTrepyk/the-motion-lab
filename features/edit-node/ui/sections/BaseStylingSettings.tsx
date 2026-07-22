"use client";

import React, { useId } from "react";
import type { DivNode, MotionDivNode } from "@/entities/node";
import { IconButton, Setting } from "@/shared/ui";
import { twMerge } from "tailwind-merge";
import { findClassWithPrefix, updateClassPrefix } from "../../lib/classNameUtils";
import { ALIGN_ICONS, INPUT_STYLES } from "../controls/consts";

export interface BaseStylingSettingsProps {
	node: DivNode | MotionDivNode;
	handleClassNameChange(e: React.ChangeEvent<HTMLTextAreaElement>): void;
	handleAlignText(value: "left" | "center" | "right" | "clear"): void;
	additionalSettings?: React.ReactNode;
}

export function BaseStylingSettings({
	node,
	handleClassNameChange,
	handleAlignText,
	additionalSettings,
}: BaseStylingSettingsProps) {
	const activeTextAlign = node.props?.className?.match(/text-(left|center|right)/)?.[0]?.split("-")[1] || "auto";
	const classNameId = useId();

	const currentClasses = node.props?.className || "";

	const handlePrefixChange = (prefix: string, newValue: string) => {
		const updated = updateClassPrefix(currentClasses, prefix, newValue);
		const fakeEvent = {
			target: { value: updated },
		} as React.ChangeEvent<HTMLTextAreaElement>;
		handleClassNameChange(fakeEvent);
	};

	const currentWidth = findClassWithPrefix(currentClasses, "w");
	const currentHeight = findClassWithPrefix(currentClasses, "h");
	const currentPadding = findClassWithPrefix(currentClasses, "p");
	const currentRadius = findClassWithPrefix(currentClasses, "rounded");

	return (
		<div className="flex flex-col gap-3 py-1">
			<Setting labelText="Tailwind CSS Classes" htmlFor={classNameId}>
				<textarea
					className={twMerge(INPUT_STYLES, "min-h-20 font-mono text-xs resize-y")}
					value={currentClasses}
					onChange={handleClassNameChange}
					id={classNameId}
					placeholder="p-4 bg-slate-800 text-white rounded-xl shadow-lg..."
				/>
			</Setting>

			<Setting labelText="Text Alignment">
				<div className="flex gap-1.5" role="group">
					{(["clear", "left", "center", "right"] as const).map((align) => {
						const Icon = ALIGN_ICONS[align];
						const isActive = activeTextAlign === (align === "clear" ? "auto" : align);

						return (
							<IconButton
								key={align}
								onClick={() => handleAlignText(align)}
								color={isActive ? "primary" : "ghost"}
								variant={isActive ? "filled" : "ghost"}
								className="flex-1 rounded-md"
							>
								<Icon className="w-4 h-4" />
							</IconButton>
						);
					})}
				</div>
			</Setting>

			{/* Dimensions & Spacing quick presets */}
			<div className="gap-2 grid grid-cols-2">
				<Setting labelText="Width (Ширина)">
					<select
						value={currentWidth}
						onChange={(e) => handlePrefixChange("w", e.target.value)}
						className={INPUT_STYLES}
					>
						<option value="">Auto (по умолчанию)</option>
						<option value="w-full">Full (100%)</option>
						<option value="w-32">Fixed 128px (w-32)</option>
						<option value="w-48">Fixed 192px (w-48)</option>
						<option value="w-64">Fixed 256px (w-64)</option>
						<option value="w-80">Fixed 320px (w-80)</option>
						<option value="w-fit">Fit Content</option>
					</select>
				</Setting>

				<Setting labelText="Height (Высота)">
					<select
						value={currentHeight}
						onChange={(e) => handlePrefixChange("h", e.target.value)}
						className={INPUT_STYLES}
					>
						<option value="">Auto (по умолчанию)</option>
						<option value="h-full">Full (100%)</option>
						<option value="h-32">Fixed 128px (h-32)</option>
						<option value="h-48">Fixed 192px (h-48)</option>
						<option value="h-64">Fixed 256px (h-64)</option>
						<option value="h-80">Fixed 320px (h-80)</option>
						<option value="h-fit">Fit Content</option>
					</select>
				</Setting>
			</div>

			<div className="gap-2 grid grid-cols-2">
				<Setting labelText="Padding (Отступы)">
					<select
						value={currentPadding}
						onChange={(e) => handlePrefixChange("p", e.target.value)}
						className={INPUT_STYLES}
					>
						<option value="">None (p-0)</option>
						<option value="p-2">Small (p-2)</option>
						<option value="p-4">Medium (p-4)</option>
						<option value="p-6">Large (p-6)</option>
						<option value="p-8">Extra Large (p-8)</option>
					</select>
				</Setting>

				<Setting labelText="Border Radius (Скругление)">
					<select
						value={currentRadius}
						onChange={(e) => handlePrefixChange("rounded", e.target.value)}
						className={INPUT_STYLES}
					>
						<option value="">None (rounded-none)</option>
						<option value="rounded-sm">Small (rounded-sm)</option>
						<option value="rounded-md">Medium (rounded-md)</option>
						<option value="rounded-lg">Large (rounded-lg)</option>
						<option value="rounded-xl">Extra Large (rounded-xl)</option>
						<option value="rounded-2xl">2X Large (rounded-2xl)</option>
						<option value="rounded-full">Circle (rounded-full)</option>
					</select>
				</Setting>
			</div>

			{additionalSettings}
		</div>
	);
}
