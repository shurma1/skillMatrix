WITH latest_versions AS (
  SELECT
    s."id" AS "skillId",
    MAX(sv."version") AS "maxVersion"
  FROM "skills" s
  JOIN "skillVersions" sv ON sv."skillId" = s."id"
  WHERE s."id" IN (:skillIds)
    AND s."isActive" = true
  GROUP BY s."id"
),
jobrole_users AS (
  SELECT utjr."userId", utjr."jobRoleId"
  FROM "userToJobRoles" utjr
  WHERE utjr."jobRoleId" IN (:jobRoleIds)
),
latest_user_skill AS (
  SELECT
    ucs."userId",
    ucs."skillId",
    ucs."level",
    jru."jobRoleId",
    ROW_NUMBER() OVER (
      PARTITION BY ucs."userId", ucs."skillId"
      ORDER BY ucs."date" DESC, ucs."id" DESC
    ) AS rn
  FROM "userToConfirmSkills" ucs
  JOIN latest_versions lv
    ON lv."skillId" = ucs."skillId"
   AND ucs."version" = lv."maxVersion"
  JOIN jobrole_users jru
    ON jru."userId" = ucs."userId"
  WHERE ucs."skillId" IN (:skillIds)
)
SELECT
  lus."skillId",
  lus."jobRoleId",
  COALESCE(SUM(lus."level"), 0) AS "totalLevel"
FROM latest_user_skill lus
WHERE lus.rn = 1
GROUP BY lus."skillId", lus."jobRoleId"
ORDER BY lus."skillId", lus."jobRoleId";
