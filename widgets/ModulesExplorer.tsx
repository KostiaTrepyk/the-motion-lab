"use client";

import { allTemplates, getUnmatchedTemplateSettings, labStoreActions, useLabStore } from "@/features/lab";
import { Collapse } from "@/shared/ui/Collapse";
import { IconButton } from "@/shared/ui/IconButton";
import { MdAdd } from "react-icons/md";
import { twMerge } from "tailwind-merge";

// Should show all unused modules and modules with unused settings. If module has no unused settings, it should not be shown at all.
export function ModulesExplorer({ ...attrs }: React.HTMLAttributes<HTMLDivElement>) {
	// Можно оптимизировать, что бы вытягивал только нужные модули.
	const modules = useLabStore((s) => s.modules);
	const { addModuleFromTemplate, addSetting } = labStoreActions;

	return (
		<div {...attrs} className={twMerge(attrs.className, "p-4")}>
			<div className="font-bold text-neutral-400 text-xl text-center">MODULES</div>

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
