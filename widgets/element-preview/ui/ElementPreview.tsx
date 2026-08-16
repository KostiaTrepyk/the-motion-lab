"use client";

import { GenerateElement } from "@/features/preview";
import { useViewStore, type ViewBackground } from "@/features/view-background";
import { twMerge } from "tailwind-merge";

const bgClasses: Record<ViewBackground, string> = {
	dark: "bg-neutral-950/80 border-neutral-900/80 text-white",
	light: "bg-neutral-100 border-neutral-300/80 text-neutral-900 shadow-inner",
	grid: "bg-neutral-950 border-neutral-900/80 text-white",
};

const checkerboardStyle = {
	backgroundImage:
		"url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill-opacity='0.12'%3E%3Crect width='8' height='8' fill='%23fff'/%3E%3Crect x='8' y='8' width='8' height='8' fill='%23fff'/%3E%3C/svg%3E\")",
};

export function ElementPreview({ ...attrs }: React.HTMLAttributes<HTMLDivElement>) {
	const viewBackground = useViewStore((state) => state.viewBackground);

	return (
		<div
			{...attrs}
			className={twMerge(
				"relative flex justify-center items-center border border-t-0 rounded-b-xl w-full min-h-0 overflow-hidden transition-colors duration-200 grow",
				bgClasses[viewBackground],
				attrs.className,
			)}
			style={viewBackground === "grid" ? checkerboardStyle : undefined}
		>
			<GenerateElement />
		</div>
	);
}
