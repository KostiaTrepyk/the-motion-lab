/**
 * Finds a class name with a specific prefix in a Tailwind class string.
 * Example: findClassWithPrefix("p-4 bg-red-500 w-32", "w") => "w-32"
 */
export function findClassWithPrefix(classes: string = "", prefix: string): string {
	const parts = classes.split(/\s+/);
	return parts.find((part) => part.startsWith(`${prefix}-`)) || "";
}

/**
 * Updates or replaces a class name with a specific prefix in a Tailwind class string.
 * Example: updateClassPrefix("p-4 w-32", "w", "w-full") => "p-4 w-full"
 */
export function updateClassPrefix(classes: string = "", prefix: string, newValue: string): string {
	const parts = classes.split(/\s+/).filter(Boolean);
	const filtered = parts.filter((part) => !part.startsWith(`${prefix}-`));
	if (newValue) {
		filtered.push(newValue);
	}
	return filtered.join(" ");
}
