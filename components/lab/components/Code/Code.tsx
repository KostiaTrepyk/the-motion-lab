"use client";

import { generateCodeFromModules } from "./generateCodeFromModules";
import { useContext } from "react";
import { labContext } from "@/context/lab.context";

export default function Code({ ...rest }: React.HTMLAttributes<HTMLDivElement>) {
	const { modules } = useContext(labContext);

	return (
		<div {...rest}>
			<div className="border-neutral-900 border-t"></div>
			<div className="p-4">{generateCodeFromModules(modules)}</div>
		</div>
	);
}
