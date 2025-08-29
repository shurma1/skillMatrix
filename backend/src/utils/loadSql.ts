import { readFileSync, existsSync } from 'fs';
import path from 'path';
import { ROOT_PATH } from '../index';

/**
 * Loads an SQL file by name.
 * After build, SQL files should live in ROOT/sql.
 * In dev, they may be in ROOT/src/sql.
 */
export const loadSql = (fileName: string) => {
	const candidates = [
		path.resolve(ROOT_PATH, 'sql', `${fileName}.sql`),
		path.resolve(ROOT_PATH, 'src', 'sql', `${fileName}.sql`),
	];
	const found = candidates.find((p) => existsSync(p));
	if (!found) {
		throw new Error(`SQL file not found. Tried: ${candidates.join(' , ')}`);
	}
	return readFileSync(found, 'utf-8');
};
