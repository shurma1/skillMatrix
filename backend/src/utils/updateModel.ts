export function updateModel<T extends object, U extends Partial<T>>(model: T, updateObject: U): void {
	Object.keys(updateObject).forEach((key) => {
		const value = updateObject[key as keyof U];
		if (value !== undefined) {
			(model as T)[key as keyof T] = value as T[keyof T];
		}
	});
}
