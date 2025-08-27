# Изменения в SkillDocumentPage

## Описание изменений

Изменена логика проверки подтверждения навыка на странице `SkillDocumentPage`:

### До изменений:
- Использовался эндпоинт `useGetUserSkillQuery` для получения информации о навыке пользователя
- Подтверждения получались как часть объекта `userSkill`
- Проверялся уровень через `userSkill.confirmations`

### После изменений:
- Используется специальный эндпоинт `useListUserSkillConfirmationsQuery` для получения списка подтверждений
- Подтверждения получаются напрямую через API `/api/user/{userId}/skill/{skillId}/confirmation`
- Определяется последнее подтверждение по дате (сортировка по убыванию даты)
- Если уровень последнего подтверждения равен 0 - показывается форма для подтверждения ознакомления
- Если уровень больше 0 - показывается таблица с информацией о подтверждении

## Файлы изменены:
- `/frontend/src/components/containers/SkillDocumentContainer.tsx`

## Ключевые изменения:

1. **Импорт**: Заменен `useGetUserSkillQuery` на `useListUserSkillConfirmationsQuery`

2. **API запрос**: 
   ```tsx
   // Было:
   const { data: userSkill, isFetching: isUserSkillLoading } = useGetUserSkillQuery(...)
   
   // Стало:
   const { data: confirmations = [], isFetching: isConfirmationsLoading, refetch: refetchConfirmations } = useListUserSkillConfirmationsQuery(...)
   ```

3. **Определение текущего уровня**:
   ```tsx
   // Было:
   const confirmations = userSkill?.confirmations || [];
   const currentLevel = confirmations.length === 0 ? 0 : [...confirmations].reverse()[0]?.level || 0;
   
   // Стало:
   const lastConfirmation = confirmations.length > 0 
     ? [...confirmations].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0]
     : null;
   const currentLevel = lastConfirmation?.level || 0;
   ```

4. **Обновление после подтверждения**: Добавлен вызов `refetchConfirmations()` после успешного подтверждения ознакомления

5. **Улучшенная сортировка**: В таблице ознакомления также используется правильная сортировка по дате для получения последнего подтверждения

## Логика работы:
- При загрузке страницы запрашивается список всех подтверждений пользователя по данному навыку
- Находится последнее подтверждение (по дате)
- Если последнее подтверждение имеет уровень 0 или подтверждений нет - показывается форма для подтверждения ознакомления
- Если уровень больше 0 - показывается таблица с информацией о том, что пользователь уже ознакомлен с документом
