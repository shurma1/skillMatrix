export function parseTimeString(timeStr: string) {
	const value = parseInt(timeStr);
	const unit = timeStr.replace(/[0-9]/g, '').toLowerCase();

	return { value, unit };
}
