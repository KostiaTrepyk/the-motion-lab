"use client";

import { generateCodeFromModules } from "./generateCodeFromModules";
import { useContext } from "react";
import { labContext } from "@/context/lab.context";

export interface CodeProps extends React.HTMLAttributes<HTMLDivElement> {}

export default function Code({ ...rest }: CodeProps) {
	const { modules } = useContext(labContext);

	return (
		<div {...rest}>
			<div className="border-neutral-900 border-t"></div>
			<div className="p-4">{generateCodeFromModules(modules)}</div>
		</div>
	);
}
