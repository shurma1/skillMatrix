import cron from 'node-cron';
import fs from 'fs';
import path from 'path';

export class DailyTaskService {
	private static LAST_RUN_FILE = path.join(__dirname, '../../lastRun.log');
	private tasks: Set<() => void> = new Set();

	constructor() {
	
	}
	
	public start() {
		this.init();
	}

	public register(task: () => void) {
		this.tasks.add(task);
	}

	public unregister(task: () => void) {
		this.tasks.delete(task);
	}

	private getLastRun(): number {
		if (fs.existsSync(DailyTaskService.LAST_RUN_FILE)) {
			return Number(fs.readFileSync(DailyTaskService.LAST_RUN_FILE, 'utf-8'));
		}
		return 0;
	}

	private setLastRun(timestamp: number) {
		fs.writeFileSync(DailyTaskService.LAST_RUN_FILE, String(timestamp));
	}

	private runAllTasks() {
		for (const task of this.tasks) {
			try {
				task();
			} catch (e) {
				// Можно добавить логирование ошибок
			}
		}
	}

	private checkAndRun() {
		const now = Date.now();
		const lastRun = this.getLastRun();
		console.log(lastRun, now - lastRun > 24 * 60 * 60 * 1000)
		if (now - lastRun > 24 * 60 * 60 * 1000) {
			this.runAllTasks();
			this.setLastRun(now);
		}
	}

	private init() {
		cron.schedule('0 0 * * *', () => {
			this.runAllTasks();
			this.setLastRun(Date.now());
		});
		this.checkAndRun();
	}
}
