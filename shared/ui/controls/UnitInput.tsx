"use client";

import React from "react";
import { Input } from "../Input";
import { Select } from "../Select";

export interface UnitInputProps {
	value?: string | number;
	onChange: (value: string) => void;
	units?: string[];
	placeholder?: string;
	className?: string;
	label?: string;
}

export function UnitInput({
	value,
	onChange,
	units = ["px", "%", "rem", "vh", "vw", "em", "auto"],
	placeholder = "0",
	className = "",
	label,
}: UnitInputProps) {
	const strValue = String(value ?? "");

	// Parse string into number component and unit component
	const parseValue = (raw: string): { num: string; unit: string } => {
		if (raw === "auto") return { num: "auto", unit: "auto" };
		const match = raw.match(/^([+-]?\d*(?:\.\d+)?)\s*([a-zA-Z%]*)$/);
		if (match) {
			const numPart = match[1] ?? "";
			const unitPart = match[2] ? match[2] : (units[0] ?? "px");
			return { num: numPart, unit: unitPart };
		}
		return { num: raw, unit: units[0] ?? "px" };
	};

	const { num, unit } = parseValue(strValue);

	const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newNum = e.target.value;
		if (newNum === "auto") {
			onChange("auto");
		} else if (newNum === "") {
			onChange("");
		} else {
			onChange(`${newNum}${unit === "auto" ? "px" : unit}`);
		}
	};

	const handleUnitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const newUnit = e.target.value;
		if (newUnit === "auto") {
			onChange("auto");
		} else {
			const activeNum = num === "auto" ? "0" : num || "0";
			onChange(`${activeNum}${newUnit}`);
		}
	};

	return (
		<div className={`flex items-center gap-1.5 ${className}`}>
			{label && (
				<span className="font-mono font-bold text-neutral-500 text-xs select-none shrink-0">{label}</span>
			)}
			<Input
				type={num === "auto" ? "text" : "number"}
				value={num}
				onChange={handleNumberChange}
				placeholder={placeholder}
				sizeVariant="small"
				className="flex-1 px-2 min-w-0 font-mono text-xs"
			/>
			<Select
				value={unit}
				onChange={handleUnitChange}
				sizeVariant="small"
				className="px-1 w-14 font-mono text-neutral-300 text-xs shrink-0"
			>
				{units.map((u) => (
					<option key={u} value={u}>
						{u}
					</option>
				))}
			</Select>
		</div>
	);
}
