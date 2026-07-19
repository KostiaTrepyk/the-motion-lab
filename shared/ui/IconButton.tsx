import { forwardRef } from "react";
import { twMerge } from "tailwind-merge";

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	color?: "primary" | "secondary" | "danger" | "teal" | "purple" | "ghost";
	size?: "small" | "medium" | "large";
	variant?: "filled" | "outline" | "soft" | "ghost";
}

const colors = {
	primary: "bg-amber-600 hover:bg-amber-500 hover:shadow-[0_0_20px_rgba(217,119,6,0.4)] text-white",
	secondary: "bg-neutral-600 hover:bg-neutral-500 hover:shadow-[0_0_20px_rgba(82,82,82,0.4)] text-white",
	danger: "bg-red-600 hover:bg-red-500 hover:shadow-[0_0_20px_rgba(220,38,38,0.4)] text-white",
	teal: "bg-teal-600 hover:bg-teal-500 hover:shadow-[0_0_20px_rgba(13,148,136,0.4)] text-white",
	purple: "bg-purple-600 hover:bg-purple-500 hover:shadow-[0_0_20px_rgba(147,51,234,0.4)] text-white",
	ghost: "",
};

const outlineColors = {
	primary: "border border-amber-600 hover:border-amber-500 text-amber-600 hover:bg-amber-950",
	secondary: "border border-neutral-500 hover:border-neutral-400 text-neutral-400 hover:bg-neutral-900",
	danger: "border border-red-600 hover:border-red-500 text-red-600 hover:bg-red-950",
	teal: "border border-teal-600 hover:border-teal-500 text-teal-600 hover:bg-teal-950",
	purple: "border border-purple-600 hover:border-purple-500 text-purple-600 hover:bg-purple-950",
	ghost: "",
};

const softColors = {
	primary: "bg-amber-900/40 hover:bg-amber-900/60 border border-amber-800 hover:border-amber-700 text-amber-400",
	secondary: "bg-neutral-800/40 hover:bg-neutral-800/60 border border-neutral-700 hover:border-neutral-600 text-neutral-400",
	danger: "bg-red-900/40 hover:bg-red-900/60 border border-red-800 hover:border-red-700 text-red-400",
	teal: "bg-teal-900/40 hover:bg-teal-900/60 border border-teal-800 hover:border-teal-700 text-teal-400",
	purple: "bg-purple-900/40 hover:bg-purple-900/60 border border-purple-800 hover:border-purple-700 text-purple-400",
	ghost: "",
};

const ghostColors = {
	primary: "text-amber-600 hover:bg-amber-600/20",
	secondary: "text-neutral-400 hover:bg-neutral-800 hover:text-white",
	danger: "text-red-600 hover:bg-red-600/20",
	teal: "text-teal-600 hover:bg-teal-600/20",
	purple: "text-purple-600 hover:bg-purple-600/20",
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
			if (variant === "soft") return softColors[color];
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
