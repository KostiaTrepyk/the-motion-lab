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

/**
 * Removes all class names with any of the specified prefixes from a Tailwind class string.
 * Example: clearClassPrefixes("pt-4 pr-2 pb-1 pl-3 bg-red-500", ["pt", "pr", "pb", "pl"]) => "bg-red-500"
 */
export function clearClassPrefixes(classes: string = "", prefixes: string[]): string {
	const parts = classes.split(/\s+/).filter(Boolean);
	const filtered = parts.filter((part) => !prefixes.some((prefix) => part.startsWith(`${prefix}-`)));
	return filtered.join(" ");
}
