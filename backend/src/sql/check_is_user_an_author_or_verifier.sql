SELECT s.id AS "skillId",
       sv.id AS "skillVersionId",
       sv."authorId",
       sv."verifierId"
FROM "skills" s
JOIN "skillVersions" sv
  ON sv.id = (
    SELECT sv2.id
    FROM "skillVersions" sv2
    WHERE sv2."skillId" = s.id
    ORDER BY sv2."createdAt" DESC
    LIMIT 1
  )
WHERE (:skillId IS NULL OR s.id = :skillId)
  AND (sv."authorId" = :userId OR sv."verifierId" = :userId);
