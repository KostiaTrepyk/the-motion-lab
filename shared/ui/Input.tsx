import React, { forwardRef } from "react";
import { twMerge } from "tailwind-merge";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
	sizeVariant?: "small" | "medium";
	inputVariant?: "filled" | "outline";
}

const sizeClasses = {
	small: "px-2 py-1 text-xs rounded-md",
	medium: "px-3 py-1.5 text-sm rounded-md",
};

const variantClasses = {
	filled: "bg-neutral-900 text-neutral-200 border border-neutral-800 focus:border-amber-500 focus:outline-none placeholder:text-neutral-600 transition-colors",
	outline:
		"bg-transparent text-neutral-200 border border-neutral-700 focus:border-amber-500 focus:outline-none placeholder:text-neutral-500 transition-colors",
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
	({ sizeVariant = "small", inputVariant = "filled", className, ...props }, ref) => {
		return (
			<input
				ref={ref}
				{...props}
				className={twMerge(
					"w-full font-mono transition-all",
					sizeClasses[sizeVariant],
					variantClasses[inputVariant],
					className,
				)}
			/>
		);
	},
);

Input.displayName = "Input";
