WITH jobRoleUsers AS (
  SELECT DISTINCT "userId"
  FROM "userToJobRoles"
  WHERE "jobRoleId" = :jobRoleId
),
maxSkillVersions AS (
  SELECT
    s."id" as "skillId",
    MAX(sv."version") as "maxVersion"
  FROM "skills" s
  JOIN "skillVersions" sv ON sv."skillId" = s."id"
  WHERE s."isActive" = true
  GROUP BY s."id"
),
distinctSkills AS (
  SELECT DISTINCT ON (ucs."userId", ucs."skillId")
    jrs.*,
    ucs.*
  FROM "jobRoleToSkills" AS jrs
  JOIN "userToConfirmSkills" AS ucs
    ON ucs."skillId" = jrs."skillId"
  JOIN jobRoleUsers AS jru
    ON jru."userId" = ucs."userId"
  JOIN maxSkillVersions AS msv
    ON msv."skillId" = ucs."skillId"
    AND ucs."version" = msv."maxVersion"
  WHERE jrs."jobRoleId" = :jobRoleId
  ORDER BY ucs."userId", ucs."skillId", ucs."createdAt" DESC
)
SELECT SUM("level") as totallevel
FROM distinctSkills;
