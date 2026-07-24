"use client";

import { twMerge } from "tailwind-merge";

export interface TabItem<T extends string = string> {
	id: T;
	label: string;
	icon?: React.ReactNode;
}

export interface TabsProps<T extends string = string> {
	items: TabItem<T>[];
	activeTab: T;
	onChange: (id: T) => void;
	className?: string;
	size?: "sm" | "md";
}

export function Tabs<T extends string = string>({ items, activeTab, onChange, className, size = "sm" }: TabsProps<T>) {
	return (
		<div className={twMerge("flex gap-1 bg-neutral-900/80 p-1 border border-neutral-800/80 rounded-lg", className)}>
			{items.map((tab) => {
				const isActive = activeTab === tab.id;
				return (
					<button
						key={tab.id}
						type="button"
						onClick={() => onChange(tab.id)}
						className={twMerge(
							"flex flex-1 justify-center items-center gap-1.5 rounded-md font-medium transition-all cursor-pointer select-none",
							size === "sm" ? "px-2.5 py-1 text-xs" : "px-3 py-1.5 text-sm",
							isActive
								? "bg-amber-500/15 text-amber-400 border border-amber-500/30 shadow-sm font-semibold"
								: "text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/50 border border-transparent",
						)}
					>
						{tab.icon && <span className="shrink-0">{tab.icon}</span>}
						<span>{tab.label}</span>
					</button>
				);
			})}
		</div>
	);
}
