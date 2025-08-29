-- Получение всех пользователей навыка (прямых и через должности)
WITH latest_confirmation AS (
  SELECT
    ucs.*,
    ROW_NUMBER() OVER (
      PARTITION BY ucs."userId", ucs."skillId"
      ORDER BY ucs."date" DESC, ucs."id" DESC
    ) as rn
  FROM "userToConfirmSkills" ucs
),
-- Максимально просмотренная версия навыка пользователем (во избежание дублей из-за нескольких записей просмотров)
usv_latest AS (
  SELECT
    usv."userId",
    usv."skillId",
    MAX(usv.version) AS last_viewed_version
  FROM "userSkillViews" usv
  GROUP BY usv."userId", usv."skillId"
),
-- Пользователи с прямой связью через userToSkills
direct_users AS (
  SELECT
    uts."skillId",
    uts."targetLevel",
    u.id AS "userId",
    u.login,
    u.firstname,
    u.lastname,
    u.patronymic,
    u.avatar_id AS "avatarId",
    'direct' as source
  FROM "userToSkills" uts
  JOIN users u ON uts."userId" = u.id
  WHERE uts."skillId" = :skillId
),
-- Пользователи через должности (jobRoleToSkills)
jobrole_users AS (
  SELECT
    jrs."skillId",
    jrs."targetLevel",
    u.id AS "userId",
    u.login,
    u.firstname,
    u.lastname,
    u.patronymic,
    u.avatar_id AS "avatarId",
    'jobrole' as source
  FROM "jobRoleToSkills" jrs
  JOIN "userToJobRoles" ujr ON ujr."jobRoleId" = jrs."jobRoleId"
  JOIN users u ON ujr."userId" = u.id
  WHERE jrs."skillId" = :skillId
),
-- Объединяем всех пользователей и берем максимальный targetLevel
all_users AS (
  SELECT 
    "skillId",
    "userId",
    login,
    firstname,
    lastname,
    patronymic,
    "avatarId",
    MAX("targetLevel") as "targetLevel"
  FROM (
    SELECT "skillId", "targetLevel", "userId", login, firstname, lastname, patronymic, "avatarId" FROM direct_users
    UNION
    SELECT "skillId", "targetLevel", "userId", login, firstname, lastname, patronymic, "avatarId" FROM jobrole_users
  ) combined
  GROUP BY "skillId", "userId", login, firstname, lastname, patronymic, "avatarId"
)
SELECT
  au."skillId",
  s.title,
  s.type,
  COALESCE(ucs.level, 0) AS level,
  au."targetLevel",
  CASE WHEN ucs.level >= au."targetLevel" THEN true ELSE false END AS "isConfirmed",
  CASE WHEN COALESCE(ul.last_viewed_version, 0) >= COALESCE(last_sv.version, 0) THEN false ELSE true END AS "isNew",
  last_sv."auditDate" AS "auditDate",
  last_sv."approvedDate" AS "approvedDate",
  test.id AS "testId",
  COALESCE(
    (
      SELECT json_agg(json_build_object('id', t.id, 'name', t.name))
      FROM "tagToSkills" tts
      JOIN tags t ON tts."tagId" = t.id
      WHERE tts."skillId" = s.id
    ), '[]'
  ) AS tags,
  au."userId",
  au.login,
  au.firstname,
  au.lastname,
  au.patronymic,
  au."avatarId"
FROM all_users au
JOIN skills s ON au."skillId" = s.id
LEFT JOIN latest_confirmation ucs
  ON ucs."userId" = au."userId" AND ucs."skillId" = au."skillId" AND ucs.rn = 1
LEFT JOIN usv_latest ul
  ON ul."userId" = au."userId" AND ul."skillId" = au."skillId"
LEFT JOIN LATERAL (
  SELECT sv.id, sv.version, sv."auditDate", sv."approvedDate"
  FROM "skillVersions" sv
  WHERE sv."skillId" = s.id
  ORDER BY sv.version DESC
  LIMIT 1
) last_sv ON TRUE
-- Агрегируем тесты, чтобы не размножать строки, даже если их несколько
LEFT JOIN LATERAL (
  SELECT t.id
  FROM tests t
  WHERE t."skillVersionId" = last_sv.id
  ORDER BY t.id ASC
  LIMIT 1
) test ON TRUE
ORDER BY au.login, au.firstname;
