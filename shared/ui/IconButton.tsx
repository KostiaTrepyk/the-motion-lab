import { forwardRef } from "react";
import { twMerge } from "tailwind-merge";

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	color?: "primary" | "secondary" | "danger" | "ghost";
	size?: "small" | "medium" | "large";
	variant?: "filled" | "outline" | "ghost";
}

const colors = {
	primary: "bg-amber-600 hover:bg-amber-500 hover:shadow-[0_0_20px_rgba(120,138,38,0.4)] text-white",
	secondary: "bg-neutral-600 hover:bg-neutral-500 hover:shadow-[0_0_20px_rgba(120,120,120,0.4)] text-white",
	danger: "bg-red-600 hover:bg-red-500 hover:shadow-[0_0_20px_rgba(220,38,38,0.4)] text-white",
	ghost: "",
};

const outlineColors = {
	primary: "border border-amber-600 hover:border-amber-500 text-amber-600 hover:bg-amber-950",
	secondary: "border border-neutral-500 hover:border-neutral-400 text-neutral-400 hover:bg-neutral-900",
	danger: "border border-red-600 hover:border-red-500 text-red-600 hover:bg-red-950",
	ghost: "",
};

const ghostColors = {
	primary: "text-amber-600 hover:bg-amber-600/20",
	secondary: "text-neutral-400 hover:bg-neutral-800 hover:text-white",
	danger: "text-red-600 hover:bg-red-600/20",
	ghost: "text-neutral-400 hover:bg-neutral-800 hover:text-white",
};

const sizes = {
	small: "p-1 h-6",
	medium: "p-1.5 h-8",
	large: "p-2 h-10",
};

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
	({ color = "primary", size = "medium", variant = "filled", children, className, ...attrs }, ref) => {
		const getVariantClasses = () => {
			if (variant === "outline") return outlineColors[color];
			if (variant === "ghost") return ghostColors[color];
			return colors[color];
		};

		return (
			<button
				ref={ref}
				{...attrs}
				className={twMerge(
					"inline-flex items-center justify-center rounded-full aspect-square active:scale-95 transition-all",
					getVariantClasses(),
					sizes[size],
					className,
				)}
			>
				{children}
			</button>
		);
	},
);

IconButton.displayName = "IconButton";
