"use client";

import { useAppStore } from "@/store/store";
import { generateCodeFromModules } from "./generateCodeFromModules";

export default function Code({ ...rest }: React.HTMLAttributes<HTMLDivElement>) {
	const modules = useAppStore((s) => s.modules);

	return (
		<div {...rest}>
			<div className="border-neutral-900 border-t"></div>
			<div className="p-4">{generateCodeFromModules(modules)}</div>
		</div>
	);
}
