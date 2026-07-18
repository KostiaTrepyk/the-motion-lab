import React from "react";
import { twMerge } from "tailwind-merge";

const typographyStyles = {
	h1: "text-3xl font-bold text-neutral-100 tracking-tight",
	h2: "text-2xl font-semibold text-neutral-100 tracking-tight",
	h3: "text-xl font-semibold text-neutral-100 tracking-tight",
	body: "text-base text-neutral-300 leading-relaxed",
	caption: "text-sm text-neutral-500",
	mono: "text-sm font-mono text-teal-400",
} as const;

const defaultTags: Record<TypographyType, React.ElementType> = {
	h1: "h1",
	h2: "h2",
	h3: "h3",
	body: "p",
	caption: "span",
	mono: "span",
};

export type TypographyType = keyof typeof typographyStyles;

interface TypographyProps extends React.HTMLAttributes<HTMLElement> {
	type?: TypographyType;
	as?: React.ElementType; // Позволяет переопределить HTML тег
	children: React.ReactNode;
}

export const Typography = ({ type = "body", as, className = "", children, ...props }: TypographyProps) => {
	// Если тег не передан явно, берем дефолтный из словаря
	const Component = as || defaultTags[type];
	const baseClasses = typographyStyles[type];

	return (
		<Component className={twMerge(baseClasses, className)} {...props}>
			{children}
		</Component>
	);
};
