import { useState } from "react";
import IconButton from "@/components/ui/IconButton";
import { FiRefreshCw } from "react-icons/fi";
import { twMerge } from "tailwind-merge";
import { Module } from "@/types/modules";
import { generateElementFromModules } from "./generateElementFromModules";

interface ViewProps extends React.HTMLAttributes<HTMLDivElement> {
	modules: Module[];
}

export default function View({ modules, ...rest }: ViewProps) {
	const [key, setKey] = useState<number>(1);

	function refresh() {
		setKey((prev) => prev + 1);
	}

	return (
		<div {...rest} className={twMerge(rest.className, "flex flex-col p-4")}>
			<div className="h-8">
				<IconButton className="group" onClick={refresh}>
					<FiRefreshCw className="w-full h-full group-active:rotate-180 transition-[rotate] duration-200" />
				</IconButton>
			</div>

			<div
				className="flex justify-center items-center w-full grow"
				key={key}
			>
				{/* <div className="border border-neutral-800 border-dashed"> */}
				{generateElementFromModules(modules)}
				{/* </div> */}
			</div>
		</div>
	);
}
