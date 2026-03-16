"use client";

import { useCallback, useContext, useState } from "react";
import IconButton from "@/components/ui/IconButton";
import { FiRefreshCw } from "react-icons/fi";
import { twMerge } from "tailwind-merge";
import { generateElementFromModules } from "./generateElementFromModules";
import { labContext } from "@/context/lab.context";

export default function View({ ...rest }: React.HTMLAttributes<HTMLDivElement>) {
	const [key, setKey] = useState<number>(1);

	const { modules } = useContext(labContext);

	const refresh = useCallback((): void => {
		setKey((prev) => prev + 1);
	}, []);

	/* useLayoutEffect(() => {
		refresh();
	}, [modules, refresh]); */

	return (
		<div {...rest} className={twMerge(rest.className, "flex flex-col p-4")}>
			<div className="h-8">
				<IconButton className="group" onClick={refresh}>
					<FiRefreshCw className="w-full h-full group-active:rotate-180 transition-[rotate] duration-200" />
				</IconButton>
			</div>

			<div className="flex justify-center items-center w-full grow" key={key}>
				{/* <div className="border border-neutral-800 border-dashed"> */}
				{generateElementFromModules(modules)}
				{/* </div> */}
			</div>
		</div>
	);
}
