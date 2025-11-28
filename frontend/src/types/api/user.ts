import type { TagDTO } from './tag';

export interface AddUserSkillDTO { skillId: string; targetLevel: number; }
export interface UpdateUserSkillTargetLevelDTO { targetLevel: number; }
export interface AddUserJobroleDTO { jobRoleId: string; }
export interface UserCreateDTO { login: string; firstname: string; lastname: string; patronymic: string; password: string; avatar_id?: string | null; email?: string | null; }
export interface UserUpdateDTO { login?: string; firstname?: string; lastname?: string; patronymic?: string; password?: string; avatar_id?: string | null; email?: string | null; }
export interface UserJobRoleSearchDTO { jobRoleId: string; title: string; assignedAt: string; }
export interface ConfirmationDTO { id: string; type: 'acquired' | 'debuff' | 'admin_set'; level: number; date: string; version: number; }
export interface ConfirmationCreateDTO { date: string; level: number; }
export interface ConfirmationAddResponseDTO { /* server returns added confirmation; reuse ConfirmationDTO */ }
export interface UserSkillDto { skillId: string; title: string; type: string; level: number; targetLevel: number; isConfirmed: boolean; isNew: boolean; tags: TagDTO[]; userId: string; login: string; firstname: string; lastname: string; patronymic: string; avatarId: string; confirmations: ConfirmationDTO[]; testId?: string | null; isOverdue?: boolean; }
export interface UserSkillSearchDto { skillId: string; title: string; type: string; level: number; targetLevel: number; isConfirmed: boolean; isNew: boolean; tags: TagDTO[]; userId: string; login: string; firstname: string; lastname: string; patronymic: string; avatarId: string; testId?: string | null; isOverdue?: boolean; }

// Preview of user results for login page popup
export interface UserResultPreviewDTO {
	userId: string;
	firstname: string;
	lastname: string;
	patronymic: string;
	level: number;
	targetLevel: number;
	percent: number; // completion percent
	jobRoles: string;
}

// User statistics for home page
export interface UserStatsDTO {
	needLevel: number;
	userLevel: number;
	percent: number;
}
