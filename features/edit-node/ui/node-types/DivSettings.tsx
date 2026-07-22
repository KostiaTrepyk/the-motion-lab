"use client";

import type { DivNode } from "@/entities/node";
import { Collapse } from "@/shared/ui";
import { FiLayout } from "react-icons/fi";
import { useNodeStyles } from "../../lib/useNodeStyles";
import { BaseStylingSettings } from "../sections/BaseStylingSettings";

export interface DivSettingsProps {
	node: DivNode;
}

export function DivSettings({ node }: DivSettingsProps) {
	const { updateClassName, handleAlignText } = useNodeStyles(node.id, "div");

	return (
		<Collapse text="Base / Styling" icon={<FiLayout className="w-4 h-4 text-amber-500" />} defaultOpen={true}>
			<div className="px-1 pt-2 pb-3">
				<BaseStylingSettings
					node={node}
					handleClassNameChange={(e) => updateClassName(e.target.value)}
					handleAlignText={(val) => handleAlignText(node.props?.className, val)}
				/>
			</div>
		</Collapse>
	);
}
