import { GrClear } from "react-icons/gr";
import { RxTextAlignCenter, RxTextAlignLeft, RxTextAlignRight } from "react-icons/rx";

export const INPUT_STYLES =
	"w-full bg-neutral-900 text-neutral-200 text-sm p-2 rounded-md border border-neutral-800 focus:border-amber-500 focus:outline-none transition-colors duration-200 placeholder:text-neutral-600";

export const ALIGN_ICONS = {
	clear: GrClear,
	left: RxTextAlignLeft,
	center: RxTextAlignCenter,
	right: RxTextAlignRight,
} as const;
