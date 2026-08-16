"use client";

import { labStoreActions } from "@/entities/node";
import { useEffect } from "react";

export function useUndoRedoHotkeys(): void {
	useEffect(() => {
		function handleKeyDown(event: KeyboardEvent) {
			const target = event.target as HTMLElement | null;
			if (
				target &&
				(target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable)
			) {
				return;
			}

			const isCtrlOrCmd = event.ctrlKey || event.metaKey;
			if (!isCtrlOrCmd) return;

			const key = event.key.toLowerCase();

			// Redo: Ctrl+Y or Ctrl+Shift+Z (Cmd+Shift+Z)
			if (key === "y" || (key === "z" && event.shiftKey)) {
				event.preventDefault();
				labStoreActions.redo();
				return;
			}

			// Undo: Ctrl+Z (Cmd+Z)
			if (key === "z" && !event.shiftKey) {
				event.preventDefault();
				labStoreActions.undo();
				return;
			}
		}

		window.addEventListener("keydown", handleKeyDown);
		return () => {
			window.removeEventListener("keydown", handleKeyDown);
		};
	}, []);
}
