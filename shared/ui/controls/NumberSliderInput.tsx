"use client";

import React from "react";
import { Input } from "../Input";

export interface NumberSliderInputProps {
	value: number;
	onChange: (value: number) => void;
	min?: number;
	max?: number;
	step?: number;
	className?: string;
}

export function NumberSliderInput({
	value,
	onChange,
	min = 0,
	max = 100,
	step = 1,
	className = "",
}: NumberSliderInputProps) {
	const numericValue = typeof value === "number" && !isNaN(value) ? value : min;

	return (
		<div className={`flex items-center gap-2.5 ${className}`}>
			<input
				type="range"
				min={min}
				max={max}
				step={step}
				value={numericValue}
				onChange={(e) => onChange(parseFloat(e.target.value) || min)}
				className="flex-1 bg-neutral-800 rounded-lg h-1.5 accent-amber-500 appearance-none cursor-pointer"
			/>
			<Input
				type="number"
				min={min}
				max={max}
				step={step}
				value={numericValue}
				onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
				sizeVariant="small"
				className="w-16 font-mono text-xs text-right"
			/>
		</div>
	);
}
