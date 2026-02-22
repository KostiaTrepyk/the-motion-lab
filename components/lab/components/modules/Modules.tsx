"use client";

import { labContext } from "@/context/lab.context";
import { useContext } from "react";
import { twMerge } from "tailwind-merge";
import { allModules } from "../../modules";
import IconButton from "@/components/ui/IconButton";
import { MdAdd } from "react-icons/md";
import { Collapse } from "@/components/ui/Collapse";

interface ModulesProps extends React.HTMLAttributes<HTMLDivElement> {}

export default function Modules({ ...rest }: ModulesProps) {
	const { modules, addModule, findModuleByName, toggleSettingDisabled } =
		useContext(labContext);

	return (
		<div {...rest} className={twMerge(rest.className, "p-4")}>
			{allModules.map((module) => (
				<div key={module.name}>
					<div className="flex justify-between items-center mb-2">
						<div className="text-xl">{module.name}</div>

						{findModuleByName(module.name) === undefined && (
							<IconButton
								onClick={() => addModule(module)}
								variant="outline"
								color="secondary"
							>
								<MdAdd className="w-full scale-125" />
							</IconButton>
						)}
					</div>

					{(() => {
						const m = findModuleByName(module.name);

						if (m === undefined) return null;

						return (
							<Collapse
								label="Settings"
								itemsContainerAttrs={{
									className: "flex flex-col gap-2",
								}}
							>
								{m.settings.map((setting) => {
									if (
										setting.isDisabled &&
										setting.canBeDisabled
									) {
										return (
											<div
												key={setting.id}
												className="flex justify-between items-center"
											>
												<div>{setting.label}</div>

												<IconButton
													onClick={() =>
														toggleSettingDisabled(
															module.name,
															setting.id,
														)
													}
													variant="outline"
													color="secondary"
													size="small"
												>
													<MdAdd className="w-full scale-125" />
												</IconButton>
											</div>
										);
									}
								})}
							</Collapse>
						);
					})()}
				</div>
			))}
		</div>
	);
}
