"use client";

import { twMerge } from "tailwind-merge";
import { renderSetting } from "./renderSetting";
import IconButton from "@/components/ui/IconButton";
import { MdDelete } from "react-icons/md";
import { labContext } from "@/context/lab/lab.context";
import { useContext } from "react";

export default function Settings({ ...rest }: React.HTMLAttributes<HTMLDivElement>) {
	const { modules, removeModule, changeSettingValue, toggleSettingDisabled, removeSetting } = useContext(labContext);

	return (
		<div {...rest} className={twMerge(rest.className, "p-4 overflow-y-auto")}>
			<div className="flex flex-col gap-8">
				{modules.map((module) => (
					<div key={module.name}>
						<div className="flex justify-between pb-2">
							<div className="font-bold text-xl">{module.name}</div>

							{module.name !== "Default" && (
								<IconButton
									color="secondary"
									variant="outline"
									onClick={() => removeModule(module.name)}
								>
									<MdDelete className="w-full" />
								</IconButton>
							)}
						</div>

						<div className="flex flex-col gap-2">
							{module.settings.map((setting) =>
								renderSetting(
									module,
									setting,
									changeSettingValue,
									toggleSettingDisabled,
									removeSetting,
								),
							)}
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
