import { INDENT_STEP_PX, NESTING_LINE_OFFSET_PX } from "../lib/constants";

interface DropIndicatorProps {
	depth: number;
	position: "top" | "bottom";
}

export function DropIndicator({ depth, position }: DropIndicatorProps) {
	const yClass = position === "top" ? "top-0" : "bottom-0";

	return (
		<div
			style={{ marginLeft: `${(depth - 1) * INDENT_STEP_PX + NESTING_LINE_OFFSET_PX}px` }}
			className={`${yClass} right-0 left-0 z-10 absolute bg-teal-500 h-[2px] pointer-events-none`}
		/>
	);
}
