SELECT
  s."skillId",
  jr."jobRoleId",
  COALESCE(jrts."targetLevel", 0) AS "targetLevel"
FROM UNNEST(ARRAY[:jobRoleIds]) AS jr("jobRoleId")
CROSS JOIN UNNEST(ARRAY[:skillIds]) AS s("skillId")
LEFT JOIN "jobRoleToSkills" jrts
  ON jrts."jobRoleId" = jr."jobRoleId"::uuid
 AND jrts."skillId" = s."skillId"::uuid
ORDER BY s."skillId", jr."jobRoleId";
