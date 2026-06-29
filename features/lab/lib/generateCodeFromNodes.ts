import type { CanvasNode } from "../model/types/nodes";

export function generateCodeFromNodes(nodes: CanvasNode[]): string {
	return nodes
		.map((node) => {
			if (node.type === "text") {
				return node.content;
			}

			const propsString = node.props
				? Object.entries(node.props)
						.map(([key, val]) => {
							if (typeof val === "string") return `${key}="${val}"`;
							return `${key}={${JSON.stringify(val)}}`;
						})
						.join(" ")
				: "";

			const childrenCode =
				"children" in node && node.children.length > 0 ? generateCodeFromNodes(node.children) : "";

			return `<${node.type} ${propsString}>${childrenCode}</${node.type}>`;
		})
		.join("\n");
}
