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
export const getSkillAuditStyle = (auditDate: string, baseStyle: React.CSSProperties = {}) => {
  const isAuditSoon = isSkillAuditSoon(auditDate);
  
  return {
    ...baseStyle,
    ...(isAuditSoon && {
      backgroundColor: '#fffbe6',
      borderColor: '#faad14',
      borderWidth: '1px',
      borderStyle: 'solid'
    })
  };
};
