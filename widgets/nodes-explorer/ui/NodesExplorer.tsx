import { AddNodePanel } from "@/features/add-node";
import { LayerTree } from "@/features/nodes-tree";
import { Sidebar } from "@/shared/ui";

export function NodesExplorer({ ...attrs }: React.HTMLAttributes<HTMLDivElement>) {
	return (
		<Sidebar title="Nodes" {...attrs}>
			<AddNodePanel />
			<LayerTree />
		</Sidebar>
	);
}
