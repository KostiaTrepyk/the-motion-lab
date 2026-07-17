"use client";

import { GenerateElement } from "@/features/nodes/preview";
import { IconButton } from "@/shared/ui/IconButton";
import { useState } from "react";
import { FiRefreshCw } from "react-icons/fi";
import { twMerge } from "tailwind-merge";

export function ElementPreview({ ...attrs }: React.HTMLAttributes<HTMLDivElement>) {
	const [key, setKey] = useState<number>(1);

	function refresh(): void {
		setKey((prev) => prev + 1);
	}

	return (
		<div {...attrs} className={twMerge(attrs.className, "flex flex-col p-4")}>
			<div className="h-8">
				<IconButton className="group" onClick={refresh}>
					<FiRefreshCw className="w-full h-full group-active:rotate-180 transition-[rotate] duration-200" />
				</IconButton>
			</div>

			<div className="font-bold text-neutral-400 text-xl text-center">View</div>

			<div className="flex justify-center items-center w-full grow" key={key}>
				<GenerateElement />
			</div>
		</div>
	);
}
