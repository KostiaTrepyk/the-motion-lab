import type { DivNode, MotionDivNode } from "../types/nodes";
import { generateCodeFromNodes } from "./generateCodeFromNodes";

describe("generateCodeFromNodes", () => {
	it("должен генерировать пустой JSX элемент без свойств", () => {
		const node: DivNode = {
			id: "1",
			type: "div",
			name: "Div",
			props: {},
			children: [],
		};

		expect(generateCodeFromNodes(node)).toBe("<div />");
	});

	it("должен корректно генерировать className и style с не закавыченными ключами JS", () => {
		const node: DivNode = {
			id: "1",
			type: "div",
			name: "Div",
			props: {
				className: "flex justify-between p-4",
				style: {
					width: "100px",
					backgroundColor: "#10b981",
				},
			},
			children: [],
		};

		expect(generateCodeFromNodes(node)).toBe(
			'<div className="flex justify-between p-4" style={{ width: "100px", backgroundColor: "#10b981" }} />',
		);
	});

	it("должен корректно анимировать motion.div со свойством style и initial/animate", () => {
		const node: MotionDivNode = {
			id: "2",
			type: "motion.div",
			name: "Motion Div",
			props: {
				style: { borderRadius: "8px" },
				initial: { opacity: 0, scale: 0.9 },
				animate: { opacity: 1, scale: 1 },
			},
			children: [],
		};

		expect(generateCodeFromNodes(node)).toBe(
			'<motion.div style={{ borderRadius: "8px" }} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} />',
		);
	});

	it("должен игнорировать пустые строки в объекте style", () => {
		const node: MotionDivNode = {
			id: "3",
			type: "motion.div",
			name: "Motion Div",
			props: {
				style: {
					padding: "16px",
					borderRadius: "",
					backgroundColor: "#14b8a6",
					width: "",
					height: "auto",
					margin: "",
				},
			},
			children: [],
		};

		expect(generateCodeFromNodes(node)).toBe(
			'<motion.div style={{ padding: "16px", backgroundColor: "#14b8a6", height: "auto" }} />',
		);
	});
});
