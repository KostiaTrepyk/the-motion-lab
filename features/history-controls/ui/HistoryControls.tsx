"use client";

import { labStoreActions, useLabStore } from "@/entities/node";
import { IconButton } from "@/shared/ui";
import { FiRotateCcw, FiRotateCw } from "react-icons/fi";
import { twMerge } from "tailwind-merge";
import { useUndoRedoHotkeys } from "../lib/useUndoRedoHotkeys";

interface HistoryControlsProps {
	className?: string;
}

export function HistoryControls({ className }: HistoryControlsProps) {
	useUndoRedoHotkeys();

	const pastLength = useLabStore((state) => state.past.length);
	const futureLength = useLabStore((state) => state.future.length);

	const canUndo = pastLength > 0;
	const canRedo = futureLength > 0;

	return (
		<div className={twMerge("flex items-center gap-1", className)}>
			<IconButton
				onClick={() => labStoreActions.undo()}
				disabled={!canUndo}
				title="Отменить (Ctrl+Z / Cmd+Z)"
				variant="ghost"
				color="ghost"
				className={twMerge(
					"w-8 h-8 rounded-lg transition-all",
					!canUndo && "opacity-30 cursor-not-allowed hover:bg-transparent text-neutral-600",
				)}
			>
				<FiRotateCcw className="w-4 h-4" />
			</IconButton>

			<IconButton
				onClick={() => labStoreActions.redo()}
				disabled={!canRedo}
				title="Повторить (Ctrl+Y / Cmd+Shift+Z)"
				variant="ghost"
				color="ghost"
				className={twMerge(
					"w-8 h-8 rounded-lg transition-all",
					!canRedo && "opacity-30 cursor-not-allowed hover:bg-transparent text-neutral-600",
				)}
			>
				<FiRotateCw className="w-4 h-4" />
			</IconButton>
		</div>
	);
}
