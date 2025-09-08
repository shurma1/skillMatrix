/**
 * Проверяет, нужно ли подсвечивать навык из-за приближающейся или просроченной ревизии
 * @param auditDate - дата ревизии в формате ISO string
 * @returns true если навык нужно подсветить (ревизия просрочена или наступит в течение месяца)
 */
export const isSkillAuditSoon = (auditDate: string): boolean => {
  if (!auditDate) return false;
  
  const audit = new Date(auditDate);
  const oneMonthFromNow = new Date();
  oneMonthFromNow.setMonth(oneMonthFromNow.getMonth() + 1);
  
  // Подсвечиваем если дата ревизии наступит в течение месяца или уже прошла
  return audit <= oneMonthFromNow;
};

/**
 * Создает тестовую дату для проверки функциональности (через 2 недели от сегодня)
 */
export const getTestAuditDate = (): string => {
  const testDate = new Date();
  testDate.setDate(testDate.getDate() + 14); // Через 2 недели
  return testDate.toISOString();
};

/**
 * Возвращает стиль для подсветки навыка если до ревизии остался менее месяца
 * @param auditDate - дата ревизии в формате ISO string
 * @param baseStyle - базовые стили
 * @returns объект стилей с желтой подсветкой при необходимости
 */
export const getSkillAuditStyle = (
  auditDate: string,
  baseStyle: React.CSSProperties = {},
  options?: { isDark?: boolean }
) => {
  const isAuditSoon = isSkillAuditSoon(auditDate);

  if (!isAuditSoon) return { ...baseStyle };

  // Определяем тёмную тему либо через переданный флаг, либо через media query (fallback)
  const isDark = options?.isDark ?? (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);

  // Цвета адаптированы под темы (основаны на warning palette Ant Design)
  const lightTheme = {
    backgroundColor: '#fffbe6', // light warning bg (antd token colorWarningBg)
    borderColor: '#faad14'
  };
  const darkTheme = {
    backgroundColor: '#2f2611', // более тёмный янтарный, достаточный контраст с белым текстом
    borderColor: '#d48806'
  };

  const themeColors = isDark ? darkTheme : lightTheme;

  return {
    ...baseStyle,
    ...themeColors,
    borderWidth: '1px',
    borderStyle: 'solid'
  };
};
