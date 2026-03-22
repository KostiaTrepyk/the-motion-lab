"use client";

import IconButton from "@/components/ui/IconButton";
import { labSliceActions } from "@/store/slices/lab/labActions";
import { useAppStore } from "@/store/store";
import { MdDelete } from "react-icons/md";
import { twMerge } from "tailwind-merge";
import { renderSetting } from "./renderSetting";

export default function Settings({ ...rest }: React.HTMLAttributes<HTMLDivElement>) {
	const modules = useAppStore((s) => s.modules);
	const { removeModule, changeSettingValue, toggleSettingDisabled, removeSettingById } = labSliceActions;

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
									removeSettingById,
								),
							)}
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
