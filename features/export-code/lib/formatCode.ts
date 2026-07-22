import { generateCodeFromNodes, type CanvasNode } from "@/entities/node";
import * as babelPlugin from "prettier/plugins/babel";
import * as estreePlugin from "prettier/plugins/estree";
import * as htmlPlugin from "prettier/plugins/html";
import prettier from "prettier/standalone";

export async function formatCode(nodes: CanvasNode[] | CanvasNode): Promise<string> {
	const rawCode = generateCodeFromNodes(nodes);
	try {
		return await prettier.format(rawCode, {
			parser: "babel",
			plugins: [babelPlugin, estreePlugin, htmlPlugin],
			printWidth: 80,
			tabWidth: 4,
			semi: true,
			singleQuote: false,
		});
	} catch {
		return rawCode;
	}
}
