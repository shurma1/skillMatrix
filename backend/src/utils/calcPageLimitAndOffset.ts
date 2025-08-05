export default function (limit: unknown, page: unknown): [number, number] {
	const parsedPage = Number.isFinite(Number(page)) && Number(page) > 0 ? Number(page) : 1;
	const parsedLimit = Number.isFinite(Number(limit)) && Number(limit) > 0 ? Number(limit) : 10;
	const offset = (parsedPage - 1) * parsedLimit;
	return [parsedLimit, offset];
}