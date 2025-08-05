export function removeNullUndefined<T extends object>(obj: T): Partial<T> {
	return Object.entries(obj).reduce((acc, [key, value]) => {
		if (value !== null && value !== undefined) {
			acc[key as keyof T] = value;
		}
		return acc;
	}, {} as Partial<T>);
}
