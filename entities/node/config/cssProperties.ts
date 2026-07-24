export type ControlType = "number" | "unit" | "color" | "select" | "string";

export type CssPropertyValue = string | number;

export interface CssPropertyConfig {
	label: string;
	type: ControlType;
	category: "transform" | "layout" | "appearance" | "filter";
	min?: number;
	max?: number;
	step?: number;
	units?: string[];
	options?: string[];
	defaultValue: CssPropertyValue;
}

export const CSS_PROPERTY_REGISTRY: Record<string, CssPropertyConfig> = {
	// Transforms
	x: { label: "Translate X", type: "unit", category: "transform", units: ["px", "%", "vw"], defaultValue: "0px" },
	y: { label: "Translate Y", type: "unit", category: "transform", units: ["px", "%", "vh"], defaultValue: "0px" },
	rotate: { label: "Rotate", type: "number", category: "transform", min: -360, max: 360, step: 1, defaultValue: 0 },
	scale: { label: "Scale", type: "number", category: "transform", min: 0, max: 5, step: 0.05, defaultValue: 1 },
	scaleX: { label: "Scale X", type: "number", category: "transform", min: 0, max: 5, step: 0.05, defaultValue: 1 },
	scaleY: { label: "Scale Y", type: "number", category: "transform", min: 0, max: 5, step: 0.05, defaultValue: 1 },
	skewX: { label: "Skew X", type: "number", category: "transform", min: -180, max: 180, step: 1, defaultValue: 0 },
	skewY: { label: "Skew Y", type: "number", category: "transform", min: -180, max: 180, step: 1, defaultValue: 0 },

	// Appearance
	opacity: { label: "Opacity", type: "number", category: "appearance", min: 0, max: 1, step: 0.05, defaultValue: 1 },
	backgroundColor: { label: "Background Color", type: "color", category: "appearance", defaultValue: "#ffffff" },
	color: { label: "Text Color", type: "color", category: "appearance", defaultValue: "#000000" },
	borderRadius: {
		label: "Border Radius",
		type: "unit",
		category: "appearance",
		units: ["px", "%", "rem"],
		defaultValue: "0px",
	},
	borderColor: { label: "Border Color", type: "color", category: "appearance", defaultValue: "#000000" },
	borderWidth: { label: "Border Width", type: "unit", category: "appearance", units: ["px"], defaultValue: "0px" },
	boxShadow: {
		label: "Box Shadow",
		type: "string",
		category: "appearance",
		defaultValue: "0px 4px 10px rgba(0,0,0,0.1)",
	},

	// Layout
	width: {
		label: "Width",
		type: "unit",
		category: "layout",
		units: ["px", "%", "rem", "auto"],
		defaultValue: "auto",
	},
	height: {
		label: "Height",
		type: "unit",
		category: "layout",
		units: ["px", "%", "rem", "auto"],
		defaultValue: "auto",
	},
	display: {
		label: "Display",
		type: "select",
		category: "layout",
		options: ["flex", "block", "inline-block", "grid", "none"],
		defaultValue: "block",
	},
	gap: { label: "Gap", type: "unit", category: "layout", units: ["px", "rem"], defaultValue: "0px" },
	padding: { label: "Padding", type: "unit", category: "layout", units: ["px", "%", "rem"], defaultValue: "16px" },
	margin: { label: "Margin", type: "unit", category: "layout", units: ["px", "%", "rem"], defaultValue: "0px" },

	// Filters
	filter: { label: "Blur / Filter", type: "string", category: "filter", defaultValue: "blur(0px)" },
	backdropFilter: { label: "Backdrop Filter", type: "string", category: "filter", defaultValue: "blur(0px)" },
};
