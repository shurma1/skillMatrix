export interface LoginRequestDTO { identifier: string; password: string; }

// Новый формат refresh запроса (camelCase). Оставляем старый тип на случай ручного использования.
export interface RefreshRequestDTO { refreshToken: string; }
export interface LegacyRefreshRequestDTO { refresh_token: string; }

// Основной формат токенов теперь camelCase.
export interface TokenDTO { accessToken: string; refreshToken: string; }

// Старый формат для обратной совместимости при парсинге (не использовать в коде напрямую).
export interface LegacyTokenDTO { access_token: string; refresh_token: string; }

export interface UserDTO { id: string; login: string; firstname: string; lastname: string; patronymic: string; avatar_id?: string | null; email?: string | null; }
export interface AuthDTO { accessToken: string; refreshToken: string; user: UserDTO; }
