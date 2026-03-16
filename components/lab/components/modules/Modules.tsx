"use client";

import { labContext } from "@/context/lab/lab.context";
import { useContext } from "react";
import { twMerge } from "tailwind-merge";
import IconButton from "@/components/ui/IconButton";
import { MdAdd } from "react-icons/md";
import { Collapse } from "@/components/ui/Collapse";
import { allTemplates } from "../../../../data/templates";

export default function Modules({ ...rest }: React.HTMLAttributes<HTMLDivElement>) {
	const { addModuleFromTemplate, findModuleByName, getUnusedTemplateSettings, addSetting } = useContext(labContext);

	return (
		<div {...rest} className={twMerge(rest.className, "p-4")}>
			{allTemplates.map((template) => (
				<div key={template.name}>
					<div className="flex justify-between items-center">
						<div className="text-xl">{template.name}</div>

						{findModuleByName(template.name) === undefined && (
							<IconButton
								onClick={() => addModuleFromTemplate(template.id)}
								variant="outline"
								color="secondary"
							>
								<MdAdd className="w-full scale-125" />
							</IconButton>
						)}
					</div>

					{/* Settings */}
					{(() => {
						const m = findModuleByName(template.name);

						if (m === undefined) return null;

						return (
							<Collapse
								label="Settings"
								itemsContainerAttrs={{
									className: "flex flex-col gap-2",
								}}
							>
								{getUnusedTemplateSettings(template.id)?.map((templateSetting) => (
									<div key={templateSetting.id} className="flex justify-between items-center">
										<div>{templateSetting.label}</div>

										<IconButton
											onClick={() => addSetting(template.id, templateSetting.id)}
											variant="outline"
											color="secondary"
											size="small"
										>
											<MdAdd className="w-full scale-125" />
										</IconButton>
									</div>
								))}
							</Collapse>
						);
					})()}

					<div className="my-4 border-neutral-900 border-b w-full"></div>
				</div>
			))}
		</div>
	);
}
