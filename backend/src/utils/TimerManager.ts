class TimerManager {
    private timers = new Map<string, NodeJS.Timeout>();

    setTimer(sessionId: string, timer: NodeJS.Timeout): void {
        // Очистим предыдущий таймер если есть
        this.clearTimer(sessionId);
        this.timers.set(sessionId, timer);
    }

    clearTimer(sessionId: string): void {
        const timer = this.timers.get(sessionId);
        if (timer) {
            clearTimeout(timer);
            this.timers.delete(sessionId);
        }
    }

    hasTimer(sessionId: string): boolean {
        return this.timers.has(sessionId);
    }

    clearAll(): void {
        for (const timer of this.timers.values()) {
            clearTimeout(timer);
        }
        this.timers.clear();
    }
}

export default new TimerManager();
