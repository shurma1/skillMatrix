export interface UserLike { firstname?: string | null; lastname?: string | null; patronymic?: string | null; login: string; }

export const getUserInitials = (user: UserLike): string => {
  const parts = [user.lastname, user.firstname, user.patronymic].filter(Boolean) as string[];
  if (!parts.length) return user.login.slice(0, 2).toUpperCase();
  return parts.map(p => p[0]).join('').slice(0, 2).toUpperCase();
};
