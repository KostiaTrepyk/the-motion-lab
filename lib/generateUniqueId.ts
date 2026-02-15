let idCounter = 0;

export function generateUniqueId(): string {
	return `id-${idCounter++}`;
}
