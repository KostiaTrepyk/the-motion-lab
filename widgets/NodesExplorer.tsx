import { AddNodePanel } from "@/features/nodes/add-node";
import { LayerTree } from "@/features/nodes/nodes-tree";
import { Sidebar } from "@/shared/ui/Sidebar";

export function NodesExplorer({ ...attrs }: React.HTMLAttributes<HTMLDivElement>) {
	return (
		<Sidebar title="Nodes" {...attrs}>
			<AddNodePanel />
			<LayerTree />
		</Sidebar>
	);
}
