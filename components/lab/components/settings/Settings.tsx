import { twMerge } from "tailwind-merge";
import { renderSetting } from "./renderSetting";
import { Module } from "@/types/modules";
import IconButton from "@/components/ui/IconButton";
import { MdDelete } from "react-icons/md";

export interface SettingsProps extends React.HTMLAttributes<HTMLDivElement> {
	modules: Module[];
	removeModule: (moduleName: string) => void;
	changeModuleSetting: (
		moduleName: string,
		settingId: string,
		value: number | string,
	) => void;
}

export default function Settings({
	modules,
	removeModule,
	changeModuleSetting,
	...rest
}: SettingsProps) {
	return (
		<div
			{...rest}
			className={twMerge(rest.className, "p-4 overflow-y-auto")}
		>
			<div className="flex flex-col gap-8">
				{modules.map((module) => (
					<div key={module.name}>
						<div className="flex justify-between pb-2">
							<div className="font-bold text-xl">
								{module.name}
							</div>

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
									changeModuleSetting,
								),
							)}
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
