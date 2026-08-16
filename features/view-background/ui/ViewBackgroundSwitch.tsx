"use client";

import { FiGrid, FiMoon, FiSun } from "react-icons/fi";
import { twMerge } from "tailwind-merge";
import { useViewStore, type ViewBackground } from "../model/store";

interface ViewBackgroundSwitchProps {
	className?: string;
}

export function ViewBackgroundSwitch({ className }: ViewBackgroundSwitchProps) {
	const viewBackground = useViewStore((state) => state.viewBackground);
	const setViewBackground = useViewStore((state) => state.setViewBackground);

	const backgroundOptions: Array<{
		id: ViewBackground;
		label: string;
		icon: React.ReactNode;
	}> = [
		{
			id: "dark",
			label: "Темный фон",
			icon: <FiMoon className="w-4 h-4" />,
		},
		{
			id: "light",
			label: "Светлый фон",
			icon: <FiSun className="w-4 h-4" />,
		},
		{
			id: "grid",
			label: "Прозрачная шахматка",
			icon: <FiGrid className="w-4 h-4" />,
		},
	];

	return (
		<div
			className={twMerge(
				"flex items-center gap-0.5 bg-neutral-900/90 p-0.5 border border-neutral-800/80 rounded-lg",
				className,
			)}
		>
			{backgroundOptions.map((opt) => {
				const isActive = viewBackground === opt.id;
				return (
					<button
						key={opt.id}
						onClick={() => setViewBackground(opt.id)}
						title={opt.label}
						type="button"
						className={twMerge(
							"flex items-center gap-1.5 p-1.5 rounded-md font-medium text-xs transition-all",
							isActive
								? "bg-neutral-800 text-amber-400 shadow-sm border border-neutral-700/60"
								: "text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/40",
						)}
					>
						{opt.icon}
					</button>
				);
			})}
		</div>
	);
}
