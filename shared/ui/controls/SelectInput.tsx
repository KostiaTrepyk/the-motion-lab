"use client";

import React from "react";
import { Select } from "../Select";

export interface SelectInputProps {
	value: string;
	onChange: (value: string) => void;
	options: string[];
	className?: string;
}

export function SelectInput({ value, onChange, options, className = "" }: SelectInputProps) {
	return (
		<Select
			value={value ?? (options[0] || "")}
			onChange={(e) => onChange(e.target.value)}
			sizeVariant="small"
			className={`font-mono text-xs ${className}`}
		>
			{options.map((opt) => (
				<option key={opt} value={opt}>
					{opt}
				</option>
			))}
		</Select>
	);
}
