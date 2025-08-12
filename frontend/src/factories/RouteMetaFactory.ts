import type { RouteMeta } from '../config/route';
import type { StringKey } from '../assets/strings';

/**
 * Фабрика для создания мета-данных маршрутов
 */
export class RouteMetaFactory {
  /**
   * Создает мета-данные для публичной страницы
   */
  static createPublic(titleKey: StringKey, descriptionKey: StringKey): RouteMeta {
    return {
      titleKey,
      descriptionKey,
      showInNav: false,
    };
  }

  /**
   * Создает мета-данные для защищенной страницы
   */
  static createProtected(
    titleKey: StringKey,
    descriptionKey: StringKey,
    options: {
      navNameKey?: StringKey;
      showInNav?: boolean;
    } = {}
  ): RouteMeta {
    return {
      titleKey,
      descriptionKey,
      navNameKey: options.navNameKey,
      showInNav: options.showInNav ?? false,
    };
  }

  /**
   * Создает мета-данные для страницы навигации
   */
  static createNavigation(
    titleKey: StringKey,
    descriptionKey: StringKey,
    navNameKey: StringKey
  ): RouteMeta {
    return {
      titleKey,
      descriptionKey,
      navNameKey,
      showInNav: true,
    };
  }
}
