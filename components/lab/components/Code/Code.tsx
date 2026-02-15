import { Module } from "@/types/modules";
import { generateCodeFromModules } from "./generateCodeFromModules";

export interface CodeProps extends React.HTMLAttributes<HTMLDivElement> {
	modules: Module[];
}

export default function Code({ modules, ...rest }: CodeProps) {
	return (
		<div {...rest}>
			<div className="border-neutral-900 border-t"></div>
			<div className="p-4">{generateCodeFromModules(modules)}</div>
		</div>
	);
}
