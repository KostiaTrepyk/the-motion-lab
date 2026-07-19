import { labStoreActions, type CanvasNode, type DropPosition } from "@/entities/node";
import { IconButton } from "@/shared/ui";
import { FiEye, FiEyeOff, FiLock, FiUnlock } from "react-icons/fi";
import { INDENT_STEP_PX } from "../lib/constants";

interface NodeRowProps {
	node: CanvasNode;
	depth: number;
	isSelected: boolean;
	dropPosition: DropPosition | null;
	dragProps: React.HTMLAttributes<HTMLDivElement>;
	onClick: (e: React.MouseEvent) => void;
}

export function NodeRow({ node, depth, isSelected, dropPosition, dragProps, onClick }: NodeRowProps) {
	return (
		<div
			{...dragProps}
			onClick={onClick}
			style={{ paddingLeft: `${depth * INDENT_STEP_PX}px` }}
			className={`
                group flex items-center py-1.5 px-3 cursor-pointer select-none text-sm border-l-2
                hover:bg-white/5 transition-colors relative
				${isSelected ? "bg-teal-900/20 border-teal-500 text-teal-400" : "border-transparent text-neutral-300"}
				${node.hidden ? "opacity-50" : "opacity-100"}
				${dropPosition === "inside" ? "bg-teal-900/40 border-teal-400" : ""}
            `}
		>
			<span className="inline-block opacity-50 mr-2 w-4 text-xs text-center shrink-0">
				{node.type === "text" ? "T" : "❖"}
			</span>
			<span className="truncate">{node.name || node.type}</span>

			<div
				className={`ml-auto flex items-center gap-1.5 transition-opacity ${
					node.hidden || node.locked ? "opacity-100" : "opacity-0 group-hover:opacity-100"
				}`}
			>
				<IconButton
					className="rounded-md"
					variant="ghost"
					color={node.locked ? "primary" : "secondary"}
					title={node.locked ? "Unlock" : "Lock"}
					onClick={(e) => {
						e.stopPropagation();
						labStoreActions.toggleLocked(node.id);
					}}
				>
					{node.locked ? <FiLock className="w-3.5 h-3.5" /> : <FiUnlock className="w-3.5 h-3.5" />}
				</IconButton>

				<IconButton
					className="rounded-md"
					variant="ghost"
					color={node.hidden ? "primary" : "secondary"}
					title={node.hidden ? "Show" : "Hide"}
					onClick={(e) => {
						e.stopPropagation();
						labStoreActions.toggleHidden(node.id);
					}}
				>
					{node.hidden ? <FiEyeOff className="w-3.5 h-3.5" /> : <FiEye className="w-3.5 h-3.5" />}
				</IconButton>
			</div>
		</div>
	);
}
