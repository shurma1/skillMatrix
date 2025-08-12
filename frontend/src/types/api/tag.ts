export interface TagSearchDTO { id: string; name: string; }
export interface TagDTO { id: string; name: string; skillsCount: number; }
export interface TagCreateDTO { name: string; }
export interface TagUpdateDTO { name?: string; }
