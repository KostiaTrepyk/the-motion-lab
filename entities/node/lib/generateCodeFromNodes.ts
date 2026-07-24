import type { CanvasNode } from "../types/nodes";

export function formatObjectAsJsx(obj: Record<string, unknown>): string {
	const entries = Object.entries(obj).filter(
		([_, val]) => val !== undefined && val !== null && val !== "",
	);
	if (entries.length === 0) return "{}";
	const formatted = entries
		.map(([key, val]) => {
			const jsonVal =
				typeof val === "object" && val !== null
					? formatObjectAsJsx(val as Record<string, unknown>)
					: typeof val === "string"
						? JSON.stringify(val)
						: String(val);
			return `${key}: ${jsonVal}`;
		})
		.join(", ");
	return `{ ${formatted} }`;
}

export function generateCodeFromNodes(nodes: CanvasNode | CanvasNode[]): string {
	if (!Array.isArray(nodes)) {
		nodes = [nodes];
	}

	return nodes
		.filter((node) => !node.hidden)
		.map((node) => {
			if (node.type === "text") {
				return node.content;
			}

			const propsArray: string[] = [];

			if (node.props) {
				Object.entries(node.props).forEach(([key, val]) => {
					if (val === undefined || val === null || val === "") return;

					if (key === "className") {
						if (typeof val === "string" && val.trim() !== "") {
							propsArray.push(`className="${val}"`);
						}
						return;
					}

					if (typeof val === "object") {
						const jsxObj = formatObjectAsJsx(val as Record<string, unknown>);
						if (jsxObj !== "{}") {
							propsArray.push(`${key}={${jsxObj}}`);
						}
						return;
					}

					if (typeof val === "string") {
						if (val.trim() !== "") {
							propsArray.push(`${key}="${val}"`);
						}
						return;
					}

					if (typeof val === "boolean") {
						if (val) propsArray.push(key);
						return;
					}

					propsArray.push(`${key}={${String(val)}}`);
				});
			}

			const propsString = propsArray.length > 0 ? ` ${propsArray.join(" ")}` : "";

			const childrenCode =
				"children" in node && node.children.length > 0 ? generateCodeFromNodes(node.children) : "";

			if (!childrenCode) {
				return `<${node.type}${propsString} />`;
			}

			return `<${node.type}${propsString}>${childrenCode}</${node.type}>`;
		})
		.join("\n");
}
