import {readFileSync, existsSync} from "fs";
import path from "path";
import {ROOT_PATH} from "../index";

export const loadSql = (fileName: string) => {
	const sqlPath = path.resolve(ROOT_PATH, 'src', 'sql', `${fileName}.sql`);
	if (!existsSync(sqlPath)) {
		throw new Error(`SQL file not found: ${sqlPath}`);
	}
	return readFileSync(sqlPath, 'utf-8');
}
