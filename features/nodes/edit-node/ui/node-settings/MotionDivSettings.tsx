import type { MotionDivNode } from "@/entities/node";
import { useNodeStyles } from "../../lib/useNodeStyles";
import { BaseDivSettings } from "./BaseDivSettings";

export interface MotionDivSettingsProps {
	node: MotionDivNode;
}

export function MotionDivSettings({ node }: MotionDivSettingsProps) {
	const { updateClassName, handleAlignText } = useNodeStyles(node.id, "motion.div");

	return (
		<BaseDivSettings
			node={node}
			handleClassNameChange={(e) => updateClassName(e.target.value)}
			handleAlignText={(val) => handleAlignText(node.props?.className, val)}
			additionalSettings={<></>}
		></BaseDivSettings>
	);
}
