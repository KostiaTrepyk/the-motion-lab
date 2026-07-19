import { INDENT_STEP_PX, NESTING_LINE_OFFSET_PX } from "../lib/constants";

interface NestingLineProps {
	depth: number;
}

export function NestingLine({ depth }: NestingLineProps) {
	return (
		<div
			className="top-0 bottom-0 z-0 absolute border-neutral-800 group-hover/list:border-neutral-700 border-l transition-colors pointer-events-none"
			style={{ left: `${depth * INDENT_STEP_PX + NESTING_LINE_OFFSET_PX}px` }}
		/>
	);
}
