import { labStoreActions } from "@/entities/node";

export function useNodeStyles(nodeId: string, nodeType: "div" | "motion.div") {
	function updateClassName(newClassName: string) {
		labStoreActions.updateNodeProps(nodeId, {
			type: nodeType,
			props: { className: newClassName },
		});
	}

	function handleAlignText(currentClassNames: string = "", value: "left" | "center" | "right" | "clear") {
		const newValue = value === "clear" ? "" : `text-${value}`;
		let updatedClasses = currentClassNames;

		if (value === "clear") {
			updatedClasses = currentClassNames.replace(/text-(left|center|right)/, "").trim();
		} else if (currentClassNames.match(/text-(left|center|right)/)) {
			updatedClasses = currentClassNames.replace(/text-(left|center|right)/, newValue).trim();
		} else if (newValue !== "") {
			updatedClasses = `${currentClassNames} ${newValue}`.trim();
		}

		updateClassName(updatedClasses);
	}

	return { updateClassName, handleAlignText };
}
