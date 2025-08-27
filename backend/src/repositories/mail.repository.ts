import {Mail} from "../models";
import {Op} from "sequelize";

class MailRepository {
	async create(email: string) {
		return await Mail.create({ email });
	}
	
	async bulkCreate(emails: string[]) {
		const unique = Array.from(new Set(emails));
		return await Mail.bulkCreate(
			unique.map(email => ({ email })),
			{ ignoreDuplicates: true }
		);
	}
	
	async findByEmail(email: string) {
		return await Mail.findOne({ where: { email } });
	}
	
	async exists(email: string) {
		return !!(await this.findByEmail(email));
	}
	
	async getAll(since?: Date) {
		const where = since ? { createdAt: { [Op.gte]: since } } : undefined;
		return await Mail.findAll({ where, order: [['createdAt', 'DESC']] });
	}
	
	async wasNotifiedInLastMonths(email: string, months = 1) {
		const threshold = new Date();
		threshold.setMonth(threshold.getMonth() - months);
		const count = await Mail.count({
			where: { email, createdAt: { [Op.gte]: threshold } },
		});
		return count > 0;
	}
	
	async purgeOlderThan(date: Date) {
		return await Mail.destroy({ where: { createdAt: { [Op.lt]: date } } });
	}
	
	async deleteById(id: string) {
		return (await Mail.destroy({ where: { id } })) > 0;
	}
	
	async deleteByEmail(email: string) {
		return await Mail.destroy({ where: { email } });
	}
}

export default new MailRepository();
