import { labStoreActions } from "@/entities/node";
import { clearClassPrefixes, findClassWithPrefix, updateClassPrefix } from "./classNameUtils";

export function useNodeStyles(nodeId: string, nodeType: "div" | "motion.div") {
	function updateClassName(newClassName: string) {
		labStoreActions.updateNodeProps(nodeId, {
			type: nodeType,
			props: { className: newClassName },
		});
	}

	function handleAlignText(currentClassNames: string = "", value: "left" | "center" | "right" | "clear") {
		const newValue = value === "clear" ? "" : `text-${value}`;
		let updatedClasses = currentClassNames;

		if (value === "clear") {
			updatedClasses = currentClassNames.replace(/text-(left|center|right)/, "").trim();
		} else if (currentClassNames.match(/text-(left|center|right)/)) {
			updatedClasses = currentClassNames.replace(/text-(left|center|right)/, newValue).trim();
		} else if (newValue !== "") {
			updatedClasses = `${currentClassNames} ${newValue}`.trim();
		}

		updateClassName(updatedClasses);
	}

	function clearPrefixes(currentClassNames: string = "", prefixes: string[]) {
		updateClassName(clearClassPrefixes(currentClassNames, prefixes));
	}

	function handleStyleClass(currentClassNames: string = "", prefix: string, rawVal: string) {
		const val = rawVal.trim();

		// Авто-очистка конфликтующих связанных / раздельных префиксов
		let baseClasses = currentClassNames;
		if (prefix === "p") {
			baseClasses = clearClassPrefixes(baseClasses, ["pt", "pr", "pb", "pl"]);
		} else if (["pt", "pr", "pb", "pl"].includes(prefix)) {
			baseClasses = clearClassPrefixes(baseClasses, ["p"]);
		} else if (prefix === "m") {
			baseClasses = clearClassPrefixes(baseClasses, ["mt", "mr", "mb", "ml"]);
		} else if (["mt", "mr", "mb", "ml"].includes(prefix)) {
			baseClasses = clearClassPrefixes(baseClasses, ["m"]);
		}

		if (!val) {
			updateClassName(updateClassPrefix(baseClasses, prefix, ""));
			return;
		}

		let newClass = "";
		if (val.startsWith(`${prefix}-`)) {
			newClass = val;
		} else if (val.endsWith(".")) {
			// Сохраняем незавершенную точку во время ввода: "20." -> p-[20.]
			newClass = `${prefix}-[${val}]`;
		} else if (/^\d+(\.\d+)?$/.test(val)) {
			// Чистые целые и дробные числа: "20" -> p-20, "20.5" -> p-20.5
			newClass = `${prefix}-${val}`;
		} else if (
			/^[a-z]+(-\d+)?(\/\d+)?$/i.test(val) ||
			/^(auto|full|fit|screen|none|xs|sm|md|lg|xl|2xl|3xl|4xl|5xl|6xl|7xl|8xl|9xl|inherit|initial|unset|transparent|current|black|white)$/i.test(
				val,
			)
		) {
			// Стандартные имена цветов и ключевые слова Tailwind: "teal-200" -> bg-teal-200, "red-500/80" -> bg-red-500/80
			newClass = `${prefix}-${val}`;
		} else if (val.startsWith("[") && val.endsWith("]")) {
			newClass = `${prefix}-${val}`;
		} else {
			// Кастомные значения hex/rgb с квадратными скобками: "#0d9488" -> bg-[#0d9488]
			newClass = `${prefix}-[${val}]`;
		}

		updateClassName(updateClassPrefix(baseClasses, prefix, newClass));
	}

	function getStyleClassVal(currentClassNames: string = "", prefix: string): string {
		const found = findClassWithPrefix(currentClassNames, prefix);
		if (!found) return "";
		const raw = found.slice(prefix.length + 1);
		if (raw.startsWith("[") && raw.endsWith("]")) {
			return raw.slice(1, -1);
		}
		return raw;
	}

	function updateStyle(styleProps: Partial<React.CSSProperties>) {
		labStoreActions.updateNodeStyle(nodeId, styleProps);
	}

	function updateStyleProp<K extends keyof React.CSSProperties>(property: K, value: React.CSSProperties[K]) {
		labStoreActions.updateNodeStyle(nodeId, { [property]: value });
	}

	function removeStyleProp(property: keyof React.CSSProperties) {
		labStoreActions.removeStyleProperty(nodeId, property);
	}

	return {
		updateClassName,
		updateStyle,
		updateStyleProp,
		removeStyleProp,
		handleAlignText,
		handleStyleClass,
		getStyleClassVal,
		clearPrefixes,
	};
}
