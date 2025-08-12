import type { TagSearchDTO } from './tag';

export interface JobRoleDTO { id: string; title: string; }
export interface JobRoleSearchDTO { id: string; title: string; }
export interface JobRoleSkillSearchDTO { skillId: string; title: string; type: string; tags: TagSearchDTO[]; targetLevel: number; testId?: string | null; }
export interface JobRoleUserSearchDTO { userId: string; login: string; email?: string | null; firstname: string; lastname: string; patronymic: string; avatarId?: string | null; assignedAt: string; }
export interface CreateJobRoleDTO { title: string; }
export interface UpdateJobRoleDTO { title?: string; }
export interface AddJobRoleSkillDTO { skillId: string; targetLevel: number; }
export interface UpdateJobRoleSkillDTO { targetLevel: number; }
