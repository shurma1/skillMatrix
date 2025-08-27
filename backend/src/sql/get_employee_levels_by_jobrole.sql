SELECT t."userId", COALESCE(SUM(t."level"), 0) AS "level"
FROM (
  SELECT ucs."userId",
         ucs."skillId",
         ucs."level",
         ROW_NUMBER() OVER (
           PARTITION BY ucs."userId", ucs."skillId"
           ORDER BY ucs."date" DESC, ucs."version" DESC, ucs."id" DESC
         ) AS rn
  FROM "userToConfirmSkills" AS ucs
  INNER JOIN "jobRoleToSkills" AS jrs ON jrs."skillId" = ucs."skillId"
  WHERE jrs."jobRoleId" = :jobRoleId
) AS t
WHERE t.rn = 1
GROUP BY t."userId"
ORDER BY t."userId";
