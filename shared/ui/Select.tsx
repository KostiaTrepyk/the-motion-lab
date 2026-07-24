import React, { forwardRef } from "react";
import { twMerge } from "tailwind-merge";

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
	sizeVariant?: "small" | "medium";
}

const sizeClasses = {
	small: "px-2 py-1 text-xs rounded-md",
	medium: "px-3 py-1.5 text-sm rounded-md",
};

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
	({ sizeVariant = "small", className, children, ...props }, ref) => {
		return (
			<select
				ref={ref}
				{...props}
				className={twMerge(
					"bg-neutral-900 border border-neutral-800 focus:border-amber-500 focus:outline-none w-full text-neutral-200 transition-colors cursor-pointer",
					sizeClasses[sizeVariant],
					className,
				)}
			>
				{children}
			</select>
		);
	},
);

Select.displayName = "Select";
