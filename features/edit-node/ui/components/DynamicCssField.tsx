"use client";

import { CSS_PROPERTY_REGISTRY, type CssPropertyValue } from "@/entities/node";
import { ColorPickerInput, Input, NumberSliderInput, SelectInput, UnitInput } from "@/shared/ui";
import { FiX } from "react-icons/fi";

export interface DynamicCssFieldProps {
	propKey: string;
	value: CssPropertyValue;
	onChange: (value: CssPropertyValue) => void;
	onRemove: () => void;
}

export function DynamicCssField({ propKey, value, onChange, onRemove }: DynamicCssFieldProps) {
	const config = CSS_PROPERTY_REGISTRY[propKey];
	const label = config?.label || propKey;

	return (
		<div className="group flex flex-col gap-1.5 bg-neutral-950/40 p-2.5 border border-neutral-800/50 rounded-lg">
			<div className="flex justify-between items-center">
				<span className="font-mono font-medium text-neutral-300 text-xs">{label}</span>
				<button
					type="button"
					onClick={onRemove}
					title="Remove property"
					className="opacity-60 hover:opacity-100 p-0.5 rounded text-neutral-500 hover:text-red-400 transition-colors"
				>
					<FiX className="w-3.5 h-3.5" />
				</button>
			</div>

			<div className="pt-0.5">
				{!config ? (
					/* Escape Hatch for custom CSS keys */
					<Input
						type="text"
						value={String(value ?? "")}
						onChange={(e) => onChange(e.target.value)}
						placeholder="value"
						sizeVariant="small"
						className="font-mono text-xs"
					/>
				) : (
					<>
						{config.type === "number" && (
							<NumberSliderInput
								min={config.min}
								max={config.max}
								step={config.step}
								value={typeof value === "number" ? value : Number(value ?? config.defaultValue)}
								onChange={(val) => onChange(val)}
							/>
						)}
						{config.type === "unit" && (
							<UnitInput
								units={config.units}
								value={value ?? String(config.defaultValue)}
								onChange={(val) => onChange(val)}
							/>
						)}
						{config.type === "color" && (
							<ColorPickerInput
								value={String(value ?? config.defaultValue)}
								onChange={(val) => onChange(val)}
							/>
						)}
						{config.type === "select" && (
							<SelectInput
								options={config.options || []}
								value={String(value ?? config.defaultValue)}
								onChange={(val) => onChange(val)}
							/>
						)}
						{config.type === "string" && (
							<Input
								type="text"
								value={String(value ?? config.defaultValue)}
								onChange={(e) => onChange(e.target.value)}
								sizeVariant="small"
								className="font-mono text-xs"
							/>
						)}
					</>
				)}
			</div>
		</div>
	);
}
