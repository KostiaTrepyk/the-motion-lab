"use client";

import { CodeViewer } from "@/widgets/code-viewer";
import { ElementPreview } from "@/widgets/element-preview";
import { NodesExplorer } from "@/widgets/nodes-explorer";
import { SettingsSidebar } from "@/widgets/settings-sidebar";
import { motion } from "motion/react";

export default function LabPage() {
	return (
		<main className="h-screen overflow-hidden">
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ duration: 0.75 }}
				className="grid grid-cols-5 h-full"
			>
				<NodesExplorer className="border-neutral-900 border-r h-full min-h-0" />

				<div className="flex flex-col justify-between col-span-3 h-full min-h-0">
					<ElementPreview className="min-h-0 grow-5" />
					<CodeViewer />
				</div>

				<SettingsSidebar className="border-neutral-900 border-l h-full min-h-0" />
			</motion.div>
		</main>
	);
}
