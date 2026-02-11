import { twMerge } from "tailwind-merge";

interface ButtonProps
	extends
		React.PropsWithChildren,
		React.ButtonHTMLAttributes<HTMLButtonElement> {
	color?: "primary" | "secondary" | "danger";
	size?: "small" | "medium" | "large";
	variant?: "filled" | "outline";
}

const colors = {
	primary:
		"bg-amber-600 hover:bg-amber-500 hover:shadow-[0_0_20px_rgba(120,138,38,0.4)]",
	secondary:
		"bg-neutral-600 hover:bg-neutral-500 hover:shadow-[0_0_20px_rgba(120,120,120,0.4)]",
	danger: "bg-red-600 hover:bg-red-500 hover:shadow-[0_0_20px_rgba(220,38,38,0.4)]",
};

const outlineColors = {
	primary:
		"border border-amber-600 hover:border-amber-500 text-amber-600 hover:bg-amber-950",
	secondary:
		"border border-neutral-500 hover:border-neutral-400 text-neutral-400 hover:bg-neutral-900",
	danger: "border border-red-600 hover:border-red-500 text-red-600 hover:bg-red-950",
};

const sizes = {
	small: "px-2 py-1 text-sm gap-0.5 rounded-md",
	medium: "px-3.5 py-2 gap-1.5 font-semibold rounded-md",
	large: "px-6 py-3 gap-2 font-semibold rounded-lg",
};

export default function Button({
	color = "primary",
	size = "medium",
	variant = "filled",
	children,
	...attrs
}: ButtonProps) {
	return (
		<button
			{...attrs}
			className={twMerge(
				"flex items-center text-white active:scale-95 transition-all",
				variant === "filled" ? colors[color] : outlineColors[color],
				sizes[size],
				attrs.className,
			)}
		>
			{children}
		</button>
	);
}
