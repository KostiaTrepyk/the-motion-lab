import { type NestedRecord } from "@/shared/types/common";
import { AnimatePresence, motion } from "framer-motion";
import HTMLReactParser from "html-react-parser/lib/index";
import { type MotionNodeAnimationOptions } from "motion";
import { Fragment, type JSX } from "react";
import type { Module } from "../model/types/module";
import type { CanvasNode } from "../model/types/nodes";
import type { Setting } from "../model/types/setting";

/** Helper function to convert editor settings to a nested record */
function convertSettings(settings: Setting[]): NestedRecord<string | number | JSX.Element> {
	const result: ReturnType<typeof convertSettings> = {};

	settings.forEach((setting) => {
		if (setting.isDisabled && setting.canBeDisabled) return;

		if (setting.type === "object") {
			result[setting.propertyName] = convertSettings(setting.settings);
		} else {
			result[setting.propertyName] = setting.value;
		}
	});

	return result;
}

export function createSettings(modules: Module[]): {
	isMotionUsed: boolean;
	content: string | JSX.Element | JSX.Element[];
	contentAsString: string;
	componentAttributes: MotionNodeAnimationOptions;
} {
	const isMotionUsed = modules.some((module) => module.name === "Motion");
	let content: string | JSX.Element | JSX.Element[] = "";
	let contentAsString: string = "";
	let componentAttributes: MotionNodeAnimationOptions = {};

	for (const currentModule of modules) {
		switch (currentModule.name) {
			case "Default":
				currentModule.settings.forEach((setting) => {
					if (setting.propertyName === "content") {
						if (setting.type === "text") {
							content = setting.value;
							contentAsString = setting.value;
						}
						if (setting.type === "component") {
							content = HTMLReactParser(setting.value);
							contentAsString = setting.value;
						}
					}
				});
				break;

			case "Motion":
				componentAttributes = {
					...componentAttributes,
					...convertSettings(currentModule.settings),
				};
				break;

			default:
				console.error(`Unknown module: ${currentModule.name}`);
		}
	}
	return { isMotionUsed, content, contentAsString, componentAttributes };
}

export function NodeRenderer({ nodes }: { nodes: CanvasNode[] }): JSX.Element[] {
	const result: JSX.Element[] = [];

	for (const node of nodes) {
		switch (node.type) {
			case "text":
				result.push(<Fragment key={node.id}>{node.children}</Fragment>);
				break;
			case "div":
				result.push(
					<div key={node.id} {...node.props}>
						<NodeRenderer nodes={node.children} />
					</div>,
				);
				break;
			case "motion.div":
				result.push(
					<motion.div key={node.id} {...node.props}>
						<NodeRenderer nodes={node.children} />
					</motion.div>,
				);
				break;
			case "AnimatePresence":
				result.push(
					<AnimatePresence key={node.id} {...node.props}>
						<NodeRenderer nodes={node.children} />
					</AnimatePresence>,
				);
				break;
			default:
				const _exhaustiveCheck: never = node;
				console.error(`Unknown node type: ${_exhaustiveCheck}`);
		}
	}

	return result;
}
