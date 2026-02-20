import { Module } from "@/types/modules";
import { twMerge } from "tailwind-merge";

interface ModulesProps extends React.HTMLAttributes<HTMLDivElement> {
	allModules: Module[];
	addModule: (module: Module) => void;
}

export default function Modules({
	allModules,
	addModule,
	...rest
}: ModulesProps) {
	return (
		<div {...rest} className={twMerge(rest.className, "p-4")}>
			{allModules.map((module) => (
				<div key={module.name}>
					<div>{module.name}</div>
					<button onClick={() => addModule(module)}>+</button>
				</div>
			))}
		</div>
	);
}
