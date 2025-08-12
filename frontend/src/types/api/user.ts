import type { TagDTO } from './tag';

export interface AddUserSkillDTO { skillId: string; targetLevel: number; }
export interface UpdateUserSkillTargetLevelDTO { targetLevel: number; }
export interface AddUserJobroleDTO { jobRoleId: string; }
export interface UserCreateDTO { login: string; firstname: string; lastname: string; patronymic: string; password: string; avatar_id?: string | null; email?: string | null; }
export interface UserUpdateDTO { login?: string; firstname?: string; lastname?: string; patronymic?: string; password?: string; avatar_id?: string | null; email?: string | null; }
export interface UserJobRoleSearchDTO { jobRoleId: string; title: string; assignedAt: string; }
export interface ConfirmationDTO { id: string; type: 'acquired' | 'debuff'; level: number; date: string; version: number; }
export interface ConfirmationAddResponseDTO { /* server returns added confirmation; reuse ConfirmationDTO */ }
export interface UserSkillDto { skillId: string; title: string; type: string; level: number; targetLevel: number; isConfirmed: boolean; isNew: boolean; tags: TagDTO[]; userId: string; login: string; firstname: string; patronymic: string; avatarId: string; confirmations: ConfirmationDTO[]; testId?: string | null; }
export interface UserSkillSearchDto { skillId: string; title: string; type: string; level: number; targetLevel: number; isConfirmed: boolean; isNew: boolean; tags: TagDTO[]; userId: string; login: string; firstname: string; patronymic: string; avatarId: string; testId?: string | null; }
