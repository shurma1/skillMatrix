// Common helper types
export type ID = string;
export interface PaginatedResponse<T> { count: number; rows: T[]; }
