"use client";

import { labStoreActions, SettingItem, useLabStore } from "@/features/lab";
import { IconButton } from "@/shared/ui/IconButton";
import { MdDelete } from "react-icons/md";
import { twMerge } from "tailwind-merge";

export function SettingsSidebar({ ...rest }: React.HTMLAttributes<HTMLDivElement>) {
	const modules = useLabStore((s) => s.modules);
	const { removeModule } = labStoreActions;

	return (
		<div {...rest} className={twMerge(rest.className, "p-4 overflow-y-auto")}>
			<div className="font-bold text-neutral-400 text-xl text-center">SETTINGS</div>

			<div className="flex flex-col gap-8">
				{modules.map((module) => (
					<div key={module.name}>
						<div className="flex justify-between pb-2">
							<div className="font-bold text-xl">{module.name}</div>

							{module.isRequired === false && (
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
							{module.settings.map((setting) => (
								<SettingItem key={setting.id} module={module} setting={setting} />
							))}
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
