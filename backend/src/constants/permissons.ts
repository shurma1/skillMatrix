
interface IPermissionList {
	[key: string]: {
		key: string,
		name: string
	}
}

export const PERMISSIONS: IPermissionList = {
	VIEW_ALL: {
		key: 'VIEW_ALL',
		name: 'Просмотр всех данных (пользователи, навыки, должности, теги, файлы, тесты и т.д.)',
	},
	EDIT_ALL: {
		key: 'EDIT_ALL',
		name: 'Создание, изменение и удаление любых данных (пользователи, навыки, должности, теги, файлы, тесты и т.д.)',
	},
	PERMISSION_MANAGE: {
		key: 'PERMISSION_MANAGE',
		name: 'Управление правами пользователей (выдача и отзыв разрешений, ролей)',
	},
	ANALYTICS_VIEW: {
		key: 'ANALYTICS_VIEW',
		name: 'Просмотр аналитики и отчетов',
	},
};

export type PermissionKeys = keyof typeof PERMISSIONS;
