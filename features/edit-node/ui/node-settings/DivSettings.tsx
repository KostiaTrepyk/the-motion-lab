import type { DivNode } from "@/entities/node";
import { useNodeStyles } from "../../lib/useNodeStyles";
import { BaseDivSettings } from "./BaseDivSettings";

export interface DivSettingsProps {
	node: DivNode;
}

export function DivSettings({ node }: DivSettingsProps) {
	const { updateClassName, handleAlignText } = useNodeStyles(node.id, "div");

	return (
		<BaseDivSettings
			node={node}
			handleClassNameChange={(e) => updateClassName(e.target.value)}
			handleAlignText={(val) => handleAlignText(node.props?.className, val)}
		></BaseDivSettings>
	);
}
