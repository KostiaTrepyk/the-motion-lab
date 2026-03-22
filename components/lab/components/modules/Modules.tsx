"use client";

import { Collapse } from "@/components/ui/Collapse";
import IconButton from "@/components/ui/IconButton";
import { getUnmatchedTemplateSettings } from "@/store/slices/lab/helpers/getUnmatchedTemplateSettings";
import { allTemplates } from "@/data/templates";
import { labSliceActions } from "@/store/slices/lab/labActions";
import { useAppStore } from "@/store/store";
import { MdAdd } from "react-icons/md";
import { twMerge } from "tailwind-merge";

export default function Modules({ ...rest }: React.HTMLAttributes<HTMLDivElement>) {
	const modules = useAppStore((s) => s.modules);
	const { addModuleFromTemplate, addSetting } = labSliceActions;

	return (
		<div {...rest} className={twMerge(rest.className, "p-4")}>
			{allTemplates.map((template) => (
				<div key={template.name}>
					<div className="flex justify-between items-center">
						<div className="text-xl">{template.name}</div>

						{modules.find((m) => m.name === template.name) === undefined && (
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
						const m = modules.find((m) => m.name === template.name);

						if (m === undefined) return null;

						return (
							<Collapse
								label="Settings"
								itemsContainerAttrs={{
									className: "flex flex-col gap-2",
								}}
							>
								{getUnmatchedTemplateSettings(template.settings, m.settings)?.map((templateSetting) => (
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
