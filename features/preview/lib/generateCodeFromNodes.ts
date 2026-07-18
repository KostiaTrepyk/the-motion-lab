import type { CanvasNode } from "@/entities/node";

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
