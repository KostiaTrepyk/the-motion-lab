import { labStoreActions, type ElementType, type LabStoreState } from "@/entities/node";
import { generateUniqueId } from "@/shared/lib";
import { createNodeByType } from "./createNodeByType";

export const handleAddNode = (type: ElementType, currentNodeId: LabStoreState["selectedNodeId"]) => {
	const id = generateUniqueId();
	const newNode = createNodeByType(type, id);

	labStoreActions.addNode(newNode, currentNodeId);
};
