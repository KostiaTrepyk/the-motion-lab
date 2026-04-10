"use client";

import { motion } from "framer-motion";
import { useEffect, type JSX } from "react";
import { createSettings } from "../lib/createSettings";
import type { Module } from "../model/types/module";

export interface GenerateElementProps {
	modules: Module[];
}

export function GenerateElement({ modules }: GenerateElementProps): JSX.Element {
	const { isMotionUsed, content, componentAttributes } = createSettings(modules);

	useEffect(() => {
		// Проверяем, не подгрузили ли мы его уже ранее
		if (document.getElementById("tailwind-cdn") === null) {
			const script = document.createElement("script");
			script.id = "tailwind-cdn";
			script.src = "https://cdn.jsdelivr.net/npm/@unocss/runtime";
			script.async = true; // чтобы не тормозить UI

			document.head.appendChild(script);
		}
	}, []);

	if (isMotionUsed === true) {
		return <motion.div {...componentAttributes}>{content}</motion.div>;
	}

	return <div>{content}</div>;
}
