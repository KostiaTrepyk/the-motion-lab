"use client";

import { labStoreActions, type TextNode } from "@/entities/node";
import { Setting } from "@/shared/ui";

export interface TextSettingsProps {
	node: TextNode;
}

export function TextSettings({ node }: TextSettingsProps) {
	return (
		<Setting labelText="Content">
			<input
				className="bg-neutral-900 p-2 border border-neutral-700 focus:border-amber-500 rounded outline-none w-full text-white text-sm"
				value={node.content}
				onChange={(e) => labStoreActions.updateNodeContent(node.id, e.target.value)}
			/>
		</Setting>
	);
}
