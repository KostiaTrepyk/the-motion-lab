"use client";

import React, { useRef } from "react";
import { Input } from "../Input";

export interface ColorPickerInputProps {
	value?: string;
	onChange: (value: string) => void;
	className?: string;
}

export function ColorPickerInput({ value, onChange, className = "" }: ColorPickerInputProps) {
	const colorInputRef = useRef<HTMLInputElement>(null);

	const safeHex = typeof value === "string" && /^#[0-9A-Fa-f]{6}$/.test(value) ? value : "#000000";

	const handleSwatchClick = () => {
		colorInputRef.current?.click();
	};

	return (
		<div className={`flex items-center gap-2 ${className}`}>
			<div
				onClick={handleSwatchClick}
				style={{ backgroundColor: value || "#ffffff" }}
				className="relative border-neutral-700 hover:border-amber-500 rounded-md w-7 h-7 border cursor-pointer shrink-0 transition-colors"
			>
				<input
					ref={colorInputRef}
					type="color"
					value={safeHex}
					onChange={(e) => onChange(e.target.value)}
					className="top-0 left-0 absolute opacity-0 w-full h-full cursor-pointer"
				/>
			</div>
			<Input
				type="text"
				value={value ?? ""}
				onChange={(e) => onChange(e.target.value)}
				placeholder="#ffffff"
				sizeVariant="small"
				className="flex-1 font-mono text-xs"
			/>
		</div>
	);
}
