export interface LoginRequestDTO { identifier: string; password: string; }
export interface RefreshRequestDTO { refresh_token: string; }
export interface TokenDTO { access_token: string; refresh_token: string; }
export interface UserDTO { id: string; login: string; firstname: string; lastname: string; patronymic: string; avatar_id?: string | null; email?: string | null; }
export interface AuthDTO { accessToken: string; refreshToken: string; user: UserDTO; }
