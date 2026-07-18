"use client";

import React, { useState } from "react";
import { FiChevronDown } from "react-icons/fi";
import { twMerge } from "tailwind-merge";

export interface CollapseProps extends React.HTMLAttributes<HTMLDivElement> {
	text: React.ReactNode;
	defaultOpen?: boolean;
	classNames?: {
		trigger?: string;
		icon?: string;
		content?: string;
	};
}

export function Collapse({ text, children, defaultOpen = true, className, classNames, ...props }: CollapseProps) {
	const [isOpen, setIsOpen] = useState(defaultOpen);

	return (
		<div className={twMerge("flex flex-col", className)} {...props}>
			{/* Кнопка-заголовок */}
			<button
				type="button"
				onClick={() => setIsOpen(!isOpen)}
				className={twMerge(
					"group flex items-center gap-2 w-full text-left cursor-pointer",
					classNames?.trigger,
				)}
			>
				<FiChevronDown
					className={twMerge(
						"w-4 h-4 transition-transform duration-200 ease-in-out shrink-0",
						!isOpen && "-rotate-90",
						classNames?.icon,
					)}
				/>
				{/* Обертка для text на случай, если туда передадут просто строку */}
				<div className="flex-1">{text}</div>
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
