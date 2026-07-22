"use client";

import React, { useState } from "react";
import { FiChevronDown } from "react-icons/fi";
import { twMerge } from "tailwind-merge";

export interface CollapseProps extends React.HTMLAttributes<HTMLDivElement> {
	text: React.ReactNode;
	icon?: React.ReactNode;
	badge?: React.ReactNode;
	defaultOpen?: boolean;
	classNames?: {
		trigger?: string;
		icon?: string;
		content?: string;
	};
}

export function Collapse({
	text,
	icon,
	badge,
	children,
	defaultOpen = true,
	className,
	classNames,
	...props
}: CollapseProps) {
	const [isOpen, setIsOpen] = useState(defaultOpen);

	return (
		<div className={twMerge("flex flex-col border-neutral-800/60 border-b last:border-b-0", className)} {...props}>
			{/* Кнопка-заголовок */}
			<button
				type="button"
				onClick={() => setIsOpen(!isOpen)}
				className={twMerge(
					"group flex justify-between items-center gap-2 hover:bg-neutral-800/40 px-3 py-2.5 rounded-lg w-full font-semibold text-neutral-200 hover:text-white text-sm text-left transition-colors cursor-pointer select-none",
					classNames?.trigger,
				)}
			>
				<div className="flex items-center gap-2">
					{icon && <span className="text-amber-500 shrink-0">{icon}</span>}
					<span className="flex-1">{text}</span>
					{badge && <span className="ml-1 shrink-0">{badge}</span>}
				</div>
				<FiChevronDown
					className={twMerge(
						"w-4 h-4 text-neutral-400 group-hover:text-neutral-200 transition-transform duration-200 ease-in-out shrink-0",
						!isOpen && "-rotate-90",
						classNames?.icon,
					)}
				/>
			</button>

			{/* Анимируемый контейнер (CSS Grid Hack) */}
			<div
				className={twMerge(
					"grid transition-all duration-300 ease-in-out",
					isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
				)}
			>
				<div className="overflow-hidden">
					<div className={twMerge("flex flex-col", classNames?.content)}>{children}</div>
				</div>
			</div>
		</div>
	);
}
