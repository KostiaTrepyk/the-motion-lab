"use client";

import { CodeViewer } from "@/widgets/CodeViewer";
import { ElementPreview } from "@/widgets/ElementPreview";
import { NodesExplorer } from "@/widgets/NodesExplorer";
import { SettingsSidebar } from "@/widgets/SettingsSidebar";
import { motion } from "motion/react";

export default function LabPage() {
	return (
		<main>
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ duration: 0.75 }}
				className="grid grid-cols-5 h-dvh"
			>
				<NodesExplorer className="border-neutral-900 border-r h-full" />

				<div className="flex flex-col justify-between col-span-3 h-full">
					<ElementPreview className="grow-5" />
					<CodeViewer />
				</div>

				<SettingsSidebar className="border-neutral-900 border-l h-full" />
			</motion.div>
		</main>
	);
}
