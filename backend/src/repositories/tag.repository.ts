import { Tag } from '../models';
import { TagInstance } from '../models/entities/Tag';
import { Op } from 'sequelize';

export interface TagCreation {
  name: string;
}

export interface TagUpdate {
  name?: string;
}

class TagRepository {
	async create(tagData: TagCreation): Promise<TagInstance> {
		return await Tag.create(tagData);
	}

	async update(id: string, data: TagUpdate): Promise<TagInstance | null> {
		const tag = await Tag.findByPk(id);
		if (!tag) return null;
		if (data.name !== undefined) tag.name = data.name;
		await tag.save();
		return tag;
	}

	async delete(id: string): Promise<boolean> {
		const deletedCount = await Tag.destroy({ where: { id } });
		return deletedCount > 0;
	}

	async getById(id: string): Promise<TagInstance | null> {
		return await Tag.findByPk(id);
	}

	async search(query: string): Promise<TagInstance[]> {
		return await Tag.findAll({
			where: {
				name: { [Op.iLike]: `%${query}%` },
			},
		});
	}

	async getSkillsCount(id: string): Promise<number> {
		const tag = await Tag.findByPk(id, { include: ['skills'] });
		// @ts-expect-error Sequelize association typing issue
		return tag && tag.skills ? tag.skills.length : 0;
	}
}

export default new TagRepository();
