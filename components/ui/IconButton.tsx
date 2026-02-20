import { twMerge } from "tailwind-merge";

interface IconButtonProps
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
	small: "p-1 h-6",
	medium: "p-1.5 h-8",
	large: "p-1 h-10",
};

export default function IconButton({
	color = "primary",
	size = "medium",
	variant = "filled",
	children,
	...attrs
}: IconButtonProps) {
	return (
		<button
			{...attrs}
			className={twMerge(
				"rounded-full aspect-square text-white active:scale-95 transition-all",
				variant === "filled" ? colors[color] : outlineColors[color],
				sizes[size],
				attrs.className,
			)}
		>
			{children}
		</button>
	);
}
