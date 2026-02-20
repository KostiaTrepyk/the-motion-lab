import { Module } from "@/types/modules";
import { motion } from "framer-motion";
import { type JSX } from "react";
import { createSettings } from "../createSettings";

export function generateElementFromModules(modules: Module[]): JSX.Element {
	const { isMotionUsed, content, componentAttributes } = createSettings(modules);

	if (isMotionUsed === true) {
		return <motion.div {...componentAttributes}>{content}</motion.div>;
	}

	return <div>{content}</div>;
}
