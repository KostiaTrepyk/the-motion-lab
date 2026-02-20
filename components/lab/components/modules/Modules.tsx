"use client";

import { labContext } from "@/context/lab.context";
import { useContext } from "react";
import { twMerge } from "tailwind-merge";
import { allModules } from "../../modules";

interface ModulesProps extends React.HTMLAttributes<HTMLDivElement> {}

export default function Modules({ ...rest }: ModulesProps) {
	const { addModule } = useContext(labContext);

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
