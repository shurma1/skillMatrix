-- Запрос для получения всех навыков связанных с пользователем
-- как напрямую (через userToSkills), так и через должности (через jobRoleToSkills)
-- Входные параметры: userId (uuid)
-- Возвращает: подробную информацию о навыках с авторами, верификаторами и уровнями
WITH latest_skill_versions AS (
  -- Получаем последнюю версию для каждого навыка
  SELECT 
    sv."skillId",
    sv.id AS "versionId",
    sv."verifierId",
    sv."authorId",
    sv."approvedDate",
    sv."auditDate",
    sv."version",
    ROW_NUMBER() OVER (PARTITION BY sv."skillId" ORDER BY sv."version" DESC) as rn
  FROM "skillVersions" sv
),
latest_user_confirmations AS (
  -- Получаем последние подтверждения навыков для пользователя
  SELECT DISTINCT ON (ucs."skillId")
    ucs."skillId", 
    ucs."level",
    ucs."date"
  FROM "userToConfirmSkills" ucs
  INNER JOIN latest_skill_versions lsv 
    ON lsv."skillId" = ucs."skillId" 
    AND lsv."version" = ucs."version"
  WHERE ucs."userId" = :userId
  ORDER BY ucs."skillId", ucs."date" DESC, ucs."id" DESC
),
-- Навыки с прямой связью через userToSkills
direct_skills AS (
  SELECT DISTINCT
    s.id AS "skillId",
    s.title,
    s."documentId",
    uts."targetLevel",
    COALESCE(luc."level", 0) AS "currentLevel",
    lsv."verifierId",
    lsv."authorId",
    lsv."version",
    lsv."approvedDate",
    lsv."auditDate"
  FROM "userToSkills" uts
  JOIN skills s ON uts."skillId" = s.id
  LEFT JOIN latest_user_confirmations luc ON luc."skillId" = s.id
  LEFT JOIN latest_skill_versions lsv ON lsv."skillId" = s.id AND lsv.rn = 1
  WHERE uts."userId" = :userId AND s."isActive" = true
),
-- Навыки через должности (jobRoleToSkills)
jobrole_skills AS (
  SELECT DISTINCT
    s.id AS "skillId",
    s.title,
    s."documentId",
    jrs."targetLevel",
    COALESCE(luc."level", 0) AS "currentLevel",
    lsv."verifierId",
    lsv."authorId",
    lsv."version",
    lsv."approvedDate",
    lsv."auditDate"
  FROM "jobRoleToSkills" jrs
  JOIN "userToJobRoles" ujr ON ujr."jobRoleId" = jrs."jobRoleId"
  JOIN skills s ON jrs."skillId" = s.id
  LEFT JOIN latest_user_confirmations luc ON luc."skillId" = s.id
  LEFT JOIN latest_skill_versions lsv ON lsv."skillId" = s.id AND lsv.rn = 1
  WHERE ujr."userId" = :userId AND s."isActive" = true
),
-- Объединяем все навыки и берем максимальный target level если навык есть в обеих группах
all_skills AS (
  SELECT 
    "skillId",
    title,
    "documentId",
    MAX("targetLevel") AS "targetLevel",
    "currentLevel",
    "verifierId",
    "authorId",
    "version",
    "approvedDate",
    "auditDate"
  FROM (
    SELECT * FROM direct_skills
    UNION ALL
    SELECT * FROM jobrole_skills
  ) combined
  GROUP BY "skillId", title, "documentId", "currentLevel", "verifierId", "authorId", "version", "approvedDate", "auditDate"
)
SELECT 
  a."skillId",
  a.title,
  a."documentId",
  a."targetLevel",
  a."currentLevel",
  a."verifierId",
  a."authorId",
  a."version",
  a."approvedDate",
  a."auditDate",
  v.firstname AS "verifierFirstname",
  v.lastname AS "verifierLastname",
  auth.firstname AS "authorFirstname",
  auth.lastname AS "authorLastname"
FROM all_skills a
LEFT JOIN users v ON v.id = a."verifierId"
LEFT JOIN users auth ON auth.id = a."authorId"
ORDER BY a.title;
