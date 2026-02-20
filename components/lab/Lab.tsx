import { motion } from "motion/react";
import Modules from "./components/modules/Modules";
import View from "./components/view/View";
import Settings from "./components/settings/Settings";
import Code from "./components/code/Code";

export default function Lab() {
	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ duration: 0.75 }}
			className="grid grid-cols-5 h-dvh"
		>
			<Modules className="border-neutral-900 border-r h-full" />

			<div className="flex flex-col justify-between col-span-3 h-full">
				<View className="grow-5" />
				<Code />
			</div>

			<Settings className="border-neutral-900 border-l h-full" />
		</motion.div>
	);
}
