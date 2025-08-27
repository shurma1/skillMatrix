-- Запрос для получения матрицы уровней навыков пользователей
-- Входные параметры: userIds (array) и skillIds (array)
-- Возвращает матрицу: skillIds.length на userIds.length
WITH latest_skill_versions AS (
  -- Получаем последнюю версию для каждого навыка
  SELECT 
    sv."skillId",
    MAX(sv."version") AS "maxVersion"
  FROM "skillVersions" sv
  WHERE sv."skillId" = ANY(ARRAY[:skillIds]::uuid[])
  GROUP BY sv."skillId"
),
latest_user_confirmations AS (
  -- Получаем последние подтверждения навыков для каждого пользователя и навыка
  SELECT DISTINCT ON (ucs."userId", ucs."skillId")
    ucs."userId",
    ucs."skillId", 
    ucs."level",
    ucs."date"
  FROM "userToConfirmSkills" ucs
  INNER JOIN latest_skill_versions lsv 
    ON lsv."skillId" = ucs."skillId" 
    AND lsv."maxVersion" = ucs."version"
  WHERE ucs."userId" = ANY(ARRAY[:userIds]::uuid[])
    AND ucs."skillId" = ANY(ARRAY[:skillIds]::uuid[])
  ORDER BY ucs."userId", ucs."skillId", ucs."date" DESC, ucs."id" DESC
)
SELECT
  s."skillId",
  u."userId",
  COALESCE(luc."level", 0) AS "level"
FROM UNNEST(ARRAY[:skillIds]::uuid[]) AS s("skillId")
CROSS JOIN UNNEST(ARRAY[:userIds]::uuid[]) AS u("userId")
LEFT JOIN latest_user_confirmations luc
  ON luc."skillId" = s."skillId"
  AND luc."userId" = u."userId"
ORDER BY s."skillId", u."userId";
