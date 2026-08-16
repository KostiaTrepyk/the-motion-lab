"use client";

import { HistoryControls } from "@/features/history-controls";
import { ViewBackgroundSwitch } from "@/features/view-background";
import { IconButton } from "@/shared/ui";
import { FiRefreshCw } from "react-icons/fi";
import { twMerge } from "tailwind-merge";

interface TopBarProps extends React.HTMLAttributes<HTMLDivElement> {
	onRefresh?: () => void;
	rightSlot?: React.ReactNode;
}

export function TopBar({ className, onRefresh, rightSlot, ...props }: TopBarProps) {
	return (
		<header
			{...props}
			className={twMerge(
				"flex items-center justify-between px-3 py-2 bg-neutral-950/80 border border-neutral-900/90 rounded-t-xl select-none gap-2",
				className,
			)}
		>
			{/* Левая группа: История действий (Undo/Redo) + Обновление */}
			<div className="flex items-center gap-1">
				<HistoryControls />

				{onRefresh && (
					<>
						<div className="w-px h-4 bg-neutral-800 mx-1" />
						<IconButton
							className="group w-8 h-8 rounded-lg"
							onClick={onRefresh}
							title="Обновить превью"
							variant="ghost"
							color="ghost"
						>
							<FiRefreshCw className="w-4 h-4 group-active:rotate-180 transition-[rotate] duration-200" />
						</IconButton>
					</>
				)}
			</div>

			{/* Центр: Заголовок VIEW */}
			<div className="flex items-center gap-2">
				<span className="text-xs font-bold uppercase tracking-widest text-neutral-400">
					View
				</span>
			</div>

			{/* Правая группа: Переключатель фона & Дополнительный слот */}
			<div className="flex items-center gap-2">
				<ViewBackgroundSwitch />
				{rightSlot}
			</div>
		</header>
	);
}
