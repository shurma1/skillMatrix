
class MemoryStorageService {
	storage: Record<string, unknown> = {};
	
	set(key: string, value: unknown): void {
		this.storage[key] = value;
	}
	
	get<T>(key: string): T | null {
		const isExist = key in this.storage;
		
		if (!isExist) {
			return null;
		}
		
		return this.storage[key] as T;
	}
	
	destroy(key: string): boolean {
		const isExist = key in this.storage;
		
		if (!isExist) {
			return false;
		}
		delete this.storage[key];
		return true;
	}
}

export default new MemoryStorageService();
