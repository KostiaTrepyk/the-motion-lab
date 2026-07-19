import { type CanvasNode, type ElementType } from "@/entities/node";

// Чистая функция-фабрика, которая только создает объект
export const createNodeByType = (type: ElementType, id: string): CanvasNode => {
	switch (type) {
		case "div":
			return {
				id,
				name: "Div",
				type: "div",
				props: { className: "p-4 bg-neutral-800 rounded-md min-h-[50px] min-w-[50px]" },
				children: [],
			};

		case "motion.div":
			return {
				id,
				name: "Motion Div",
				type: "motion.div",
				props: {
					className: "p-4 bg-teal-600 rounded-md min-h-[50px] min-w-[50px]",
					initial: { opacity: 0, scale: 0.8 },
					animate: { opacity: 1, scale: 1 },
				},
				children: [],
			};

		case "AnimatePresence":
			return {
				id,
				name: "Animate Presence",
				type: "AnimatePresence",
				props: { mode: "wait" },
				children: [],
			};

		case "text":
			return {
				id,
				name: "Text",
				type: "text",
				content: "Новый текст",
			};

		default:
			const _exhaustiveCheck: never = type;
			// В случае возврата из функции удобнее бросать ошибку (или возвращать null)
			throw new Error(`Unsupported node type: ${_exhaustiveCheck}`);
	}
};
