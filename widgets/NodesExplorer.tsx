import { AddNodePanel } from "@/features/nodes/add-node";
import { LayerTree } from "@/features/nodes/nodes-tree";
import { twMerge } from "tailwind-merge";

export function NodesExplorer({ ...attrs }: React.HTMLAttributes<HTMLDivElement>) {
	return (
		<div {...attrs} className={twMerge(attrs.className, "p-4")}>
			<div className="font-bold text-neutral-400 text-xl text-center">NODES</div>

			<AddNodePanel />
			<LayerTree />
		</div>
	);
}
