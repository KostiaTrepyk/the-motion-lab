/* 

Each element could be selected and changed.

Elements: string, div, AnimatePresence, motion.div, другие html теги похже можно добавить. 

Element settings: 
	id, 
	type: Elements, 
	children, 
	... (motion атрибуты, атрибуты html тегов и т.д.)



Возможная структура:
	element: {
		id: 1,
		type: "AnimatePresence",
		children: [
			{
				id: 2,
				type: "motion.div",
				initial: { opacity: 0 },
				animate: { opacity: 1 },
				exit: { opacity: 0 },
				children: [
					{
						id: 3,
						type: "text",
						content: "Hello, World!"
					}
				]
			}
		],
	}
*/

import type { AnimatePresenceProps, MotionProps } from "motion/react";

export type ElementType = "text" | "div" | "AnimatePresence" | "motion.div";

export interface BaseNode {
	id: string;
	name: string;
	type: ElementType;
	hidden?: boolean;
	locked?: boolean;
}

export interface TextNode extends BaseNode {
	type: "text";
	content: string;
}

export interface DivNode extends BaseNode {
	type: "div";
	props: React.HTMLAttributes<HTMLDivElement>;
	children: CanvasNode[];
}

export interface AnimatePresenceNode extends BaseNode {
	type: "AnimatePresence";
	props: AnimatePresenceProps;
	children: CanvasNode[];
}

export interface MotionDivNode extends BaseNode {
	type: "motion.div";
	props: 	MotionProps & React.HTMLAttributes<HTMLDivElement>;
	children: CanvasNode[];
}

export type CanvasNode = TextNode | DivNode | AnimatePresenceNode | MotionDivNode;
