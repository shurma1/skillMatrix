import type { TagDTO } from './tag';
import type { FileDTO } from './file';

export interface SkillVersionDTO { id: string; skillId: string; version: number; approvedDate: string; auditDate: string; files: FileDTO[]; testId?: string | null; }
export interface SkillWithCurrentVersionDTO { 
  id: string; 
  type: 'skill' | 'document'; 
  title: string; 
  isActive: boolean; 
  approvedDate: string; 
  auditDate: string; 
  authorId?: string | null; 
  verifierId: string; 
  version: number; 
  tags: TagDTO[]; 
  testId?: string | null; 
  fileId?: string; 
}
export interface CreateSkillDTO { 
  type: 'skill' | 'document'; 
  title: string; 
  approvedDate: string; 
  verifierId: string; 
  authorId?: string; 
  fileId?: string; 
}
export interface UpdateSkillDTO { title?: string; isActive?: boolean; }
export interface CreateSkillVersionDTO { fileId?: string; authorId: string; verifierid: string; }
