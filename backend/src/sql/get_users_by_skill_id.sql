-- Запрос для получения всех пользователей связанных с навыком
-- как напрямую (через userToSkills), так и через должности (через jobRoleToSkills)
-- Входные параметры: skillId (uuid)
-- Возвращает: информацию о пользователе, его текущий уровень и необходимый уровень
WITH latest_skill_versions AS (
  -- Получаем последнюю версию навыка
  SELECT 
    sv."skillId",
    MAX(sv."version") AS "maxVersion"
  FROM "skillVersions" sv
  WHERE sv."skillId" = :skillId
  GROUP BY sv."skillId"
),
latest_user_confirmations AS (
  -- Получаем последние подтверждения навыков для каждого пользователя
  SELECT DISTINCT ON (ucs."userId")
    ucs."userId",
    ucs."skillId", 
    ucs."level",
    ucs."date"
  FROM "userToConfirmSkills" ucs
  INNER JOIN latest_skill_versions lsv 
    ON lsv."skillId" = ucs."skillId" 
    AND lsv."maxVersion" = ucs."version"
  WHERE ucs."skillId" = :skillId
  ORDER BY ucs."userId", ucs."date" DESC, ucs."id" DESC
),
-- Пользователи с прямой связью через userToSkills
direct_users AS (
  SELECT DISTINCT
    u.id AS "userId",
    u.login,
    u.firstname,
    u.lastname,
    u.patronymic,
    uts."targetLevel",
    COALESCE(luc."level", 0) AS "currentLevel",
    'direct' AS "relationshipType"
  FROM "userToSkills" uts
  JOIN users u ON uts."userId" = u.id
  LEFT JOIN latest_user_confirmations luc ON luc."userId" = u.id
  WHERE uts."skillId" = :skillId
),
-- Пользователи через должности (jobRoleToSkills)
jobrole_users AS (
  SELECT DISTINCT
    u.id AS "userId",
    u.login,
    u.firstname,
    u.lastname,
    u.patronymic,
    jrs."targetLevel",
    COALESCE(luc."level", 0) AS "currentLevel",
    'jobRole' AS "relationshipType"
  FROM "jobRoleToSkills" jrs
  JOIN "userToJobRoles" ujr ON ujr."jobRoleId" = jrs."jobRoleId"
  JOIN users u ON ujr."userId" = u.id
  LEFT JOIN latest_user_confirmations luc ON luc."userId" = u.id
  WHERE jrs."skillId" = :skillId
),
-- Объединяем всех пользователей и берем максимальный target level если пользователь есть в обеих группах
all_users AS (
  SELECT 
    "userId",
    login,
    firstname,
    lastname,
    patronymic,
    MAX("targetLevel") AS "targetLevel",
    "currentLevel",
    STRING_AGG(DISTINCT "relationshipType", ', ') AS "relationshipTypes"
  FROM (
    SELECT * FROM direct_users
    UNION ALL
    SELECT * FROM jobrole_users
  ) combined
  GROUP BY "userId", login, firstname, lastname, patronymic, "currentLevel"
)
SELECT 
  "userId",
  login,
  firstname,
  lastname,
  patronymic,
  "targetLevel",
  "currentLevel",
  "relationshipTypes"
FROM all_users
ORDER BY lastname, firstname;
