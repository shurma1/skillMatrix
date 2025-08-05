import TagRepository, { TagCreation, TagUpdate } from '../repositories/tag.repository';
import { TagDTO, TagSearchDTO } from '../dtos/tag.dto';
import { ApiError } from '../error/apiError';

class TagService {
	async create(tagData: TagCreation): Promise<TagDTO> {
		const tag = await TagRepository.create(tagData);
		return new TagDTO(tag.id, tag.name, 0);
	}

	async update(id: string, data: TagUpdate): Promise<TagDTO> {
		const tag = await TagRepository.update(id, data);
		if (!tag) throw ApiError.errorByType('TAG_NOT_FOUND');
		const skillsCount = await TagRepository.getSkillsCount(id);
		return new TagDTO(tag.id, tag.name, skillsCount);
	}

	async delete(id: string): Promise<void> {
		const deleted = await TagRepository.delete(id);
		if (!deleted) throw ApiError.errorByType('TAG_NOT_FOUND');
	}

	async get(id: string): Promise<TagDTO> {
		const tag = await TagRepository.getById(id);
		if (!tag) throw ApiError.errorByType('TAG_NOT_FOUND');
		const skillsCount = await TagRepository.getSkillsCount(id);
		return new TagDTO(tag.id, tag.name, skillsCount);
	}

	async search(query: string): Promise<TagSearchDTO[]> {
		const tags = await TagRepository.search(query);
		return tags.map(tag => new TagSearchDTO(tag.id, tag.name));
	}
}

export default new TagService();
