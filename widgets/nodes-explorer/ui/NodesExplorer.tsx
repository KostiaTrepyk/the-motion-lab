import { AddNodePanel } from "@/features/add-node";
import { LayerTree } from "@/features/nodes-tree";
import { Sidebar } from "@/shared/ui";

export function NodesExplorer({ ...attrs }: React.HTMLAttributes<HTMLDivElement>) {
	return (
		<Sidebar title="Nodes" {...attrs} contentAttrs={{ className: "flex flex-col p-0 overflow-hidden" }}>
			<div className="p-4 pb-0 shrink-0">
				<AddNodePanel />
			</div>
			<LayerTree />
		</Sidebar>
	);
}
