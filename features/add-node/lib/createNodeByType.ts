import { type CanvasNode, type ElementType } from "@/entities/node";

// Чистая функция-фабрика, которая только создает объект
export const createNodeByType = (type: ElementType, id: string): CanvasNode => {
	switch (type) {
		case "div":
			return {
				id,
				name: "Div",
				type: "div",
				props: {
					style: {
						padding: "16px",
						borderRadius: "4px",
						backgroundColor: "#27272a",
					},
				},
				children: [],
			};

		case "motion.div":
			return {
				id,
				name: "Motion Div",
				type: "motion.div",
				props: {
					style: {
						padding: "16px",
						borderRadius: "4px",
						backgroundColor: "#14b8a6",
					},
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
