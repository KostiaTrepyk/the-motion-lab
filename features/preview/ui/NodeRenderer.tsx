import { labStoreActions, type CanvasNode, type DivNode, type MotionDivNode } from "@/entities/node";
import { AnimatePresence, motion } from "framer-motion";
import { Fragment, type JSX } from "react";

export function NodeRenderer({ nodes }: { nodes: CanvasNode[] }): JSX.Element[] {
	const result: JSX.Element[] = [];

	function selectNode(node: DivNode | MotionDivNode, e: React.MouseEvent<HTMLDivElement>) {
		e.stopPropagation();
		labStoreActions.changeSelectedNode(node.id);
		if (node.props && "onClick" in node.props && typeof node.props.onClick === "function") {
			node.props.onClick(e);
		}
	}

	for (const node of nodes) {
		if (node.hidden) continue;

		switch (node.type) {
			case "text":
				result.push(<Fragment key={node.id}>{node.content}</Fragment>);
				break;
			case "div":
				result.push(
					<div
						key={node.id}
						{...node.props}
						onClick={(e) => {
							e.stopPropagation();
							selectNode(node, e);
						}}
					>
						<NodeRenderer nodes={node.children} />
					</div>,
				);
				break;
			case "motion.div":
				result.push(
					<motion.div
						key={node.id}
						{...node.props}
						onClick={(e) => {
							e.stopPropagation();
							selectNode(node, e);
						}}
					>
						<NodeRenderer nodes={node.children} />
					</motion.div>,
				);
				break;
			case "AnimatePresence":
				result.push(
					<AnimatePresence key={node.id} {...node.props}>
						<NodeRenderer nodes={node.children} />
					</AnimatePresence>,
				);
				break;
			default:
				const _exhaustiveCheck: never = node;
				console.error(`Unknown node type: ${_exhaustiveCheck}`);
		}
	}

	return result;
}
