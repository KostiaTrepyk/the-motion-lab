import { twMerge } from "tailwind-merge";
import NextLink, { LinkProps as NextLinkProps } from "next/link";

interface LinkProps
	extends
		React.PropsWithChildren,
		NextLinkProps,
		Omit<
			React.AnchorHTMLAttributes<HTMLAnchorElement>,
			keyof NextLinkProps
		> {
	color?: "primary" | "secondary" | "danger";
	size?: "small" | "medium" | "large";
	variant?: "outline" | "button" | "link";
}

const buttonColors = {
	primary:
		"bg-amber-600 hover:bg-amber-500 hover:shadow-[0_0_20px_rgba(120,138,38,0.4)]",
	secondary:
		"bg-neutral-600 hover:bg-neutral-500 hover:shadow-[0_0_20px_rgba(120,120,120,0.4)]",
	danger: "bg-red-600 hover:bg-red-500 hover:shadow-[0_0_20px_rgba(220,38,38,0.4)]",
};
const button = "rounded-lg active:scale-95 transition-all";

const outlineColors = {
	primary:
		"border-1 border-amber-600 hover:border-amber-500 text-amber-600 hover:bg-amber-950",
	secondary:
		"border-1 border-neutral-500 hover:border-neutral-400 text-neutral-400 hover:bg-neutral-900",
	danger: "border-1 border-red-600 hover:border-red-500 text-red-600 hover:bg-red-950",
};

const underlineColors = {
	primary: "underline hover:text-amber-500 text-amber-600",
	secondary: "underline hover:text-neutral-400 text-neutral-400",
	danger: "underline hover:text-red-500 text-red-600",
};

const sizes = {
	small: "px-2 py-1 text-sm gap-0.5",
	medium: "px-3.5 py-2 gap-1 font-semibold",
	large: "px-6 py-3 gap-2 font-semibold",
};

export default function Link({
	color = "primary",
	size = "medium",
	variant = "link",
	children,
	...attrs
}: LinkProps) {
	return (
		<NextLink
			{...attrs}
			className={twMerge(
				"flex items-center w-fit text-white transition-colors",

				variant === "outline" && outlineColors[color] + " " + button,
				variant === "button" && buttonColors[color] + " " + button,
				variant === "link" && underlineColors[color],

				sizes[size],
				attrs.className,
			)}
		>
			{children}
		</NextLink>
	);
}
