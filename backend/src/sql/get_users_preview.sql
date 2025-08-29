WITH filtered_users AS (
  SELECT u.id, u.firstname, u.lastname, u.patronymic, u.login
  FROM "users" u
  WHERE (:query IS NULL OR :query = ''
         OR LOWER(u.firstname || ' ' || u.lastname || ' ' || u.patronymic) LIKE '%' || LOWER(:query) || '%'
         OR LOWER(u.login) LIKE '%' || LOWER(:query) || '%')
),
user_target_sum AS (
  -- targetLevel только из ролей (jobRoles)
  SELECT ur."userId",
         COALESCE(SUM(CAST(jrs."targetLevel" AS INTEGER)), 0) AS "targetLevel"
  FROM "userToJobRoles" ur
  JOIN "jobRoleToSkills" jrs ON jrs."jobRoleId" = ur."jobRoleId"
  JOIN "skills" s ON s.id = jrs."skillId" AND s."isActive" = TRUE
  JOIN filtered_users fu ON fu.id = ur."userId"
  GROUP BY ur."userId"
),
user_role_skill_ids AS (
  SELECT DISTINCT ur."userId" AS "userId", jrs."skillId" AS "skillId"
  FROM "userToJobRoles" ur
  JOIN "jobRoleToSkills" jrs ON jrs."jobRoleId" = ur."jobRoleId"
  JOIN "skills" s ON s.id = jrs."skillId" AND s."isActive" = TRUE
  JOIN filtered_users fu ON fu.id = ur."userId"
),
user_explicit_skill_ids AS (
  SELECT DISTINCT uts."userId" AS "userId", uts."skillId" AS "skillId"
  FROM "userToSkills" uts
  JOIN "skills" s ON s.id = uts."skillId" AND s."isActive" = TRUE
  JOIN filtered_users fu ON fu.id = uts."userId"
),
user_all_skills AS (
  SELECT "userId", "skillId" FROM user_role_skill_ids
  UNION
  SELECT "userId", "skillId" FROM user_explicit_skill_ids
),
max_skill_version AS (
  SELECT sv."skillId", MAX(sv."version") AS max_version
  FROM "skillVersions" sv
  JOIN user_all_skills uask ON uask."skillId" = sv."skillId"
  GROUP BY sv."skillId"
),
user_skill_levels AS (
  SELECT
    uask."userId",
    uask."skillId",
    COALESCE(utcs.level, 0) AS level
  FROM user_all_skills uask
  LEFT JOIN max_skill_version msv ON msv."skillId" = uask."skillId"
  LEFT JOIN LATERAL (
    SELECT CAST(u2.level AS INTEGER) AS level
    FROM "userToConfirmSkills" u2
    WHERE u2."userId" = uask."userId"
      AND u2."skillId" = uask."skillId"
      AND u2."version" = msv.max_version
    ORDER BY u2."date" DESC
    LIMIT 1
  ) utcs ON TRUE
),
user_current_sum AS (
  SELECT "userId", CAST(SUM(level) AS INTEGER) AS level
  FROM user_skill_levels
  GROUP BY "userId"
)
SELECT fu.id AS "userId",
       fu.firstname,
       fu.lastname,
       fu.patronymic,
       CAST(COALESCE(ucs.level, 0) AS INTEGER) AS level,
       CAST(COALESCE(uts."targetLevel", 0) AS INTEGER) AS "targetLevel",
       CASE
         WHEN COALESCE(ucs.level, 0) = 0 OR COALESCE(uts."targetLevel", 0) = 0 THEN 0
         ELSE ROUND((ucs.level::numeric / uts."targetLevel"::numeric) * 100)::integer
       END AS percent
FROM filtered_users fu
LEFT JOIN user_current_sum ucs ON ucs."userId" = fu.id
LEFT JOIN user_target_sum uts ON uts."userId" = fu.id
ORDER BY fu.lastname, fu.firstname, fu.patronymic;
