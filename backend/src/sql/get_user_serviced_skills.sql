WITH latest_versions AS (
  SELECT sv."skillId", MAX(sv."version") AS max_version
  FROM "skillVersions" sv
  GROUP BY sv."skillId"
)
SELECT
  s.id AS "id",
  s.type AS "type",
  s.title AS "title",
  s."isActive" AS "isActive",
  s."documentId" AS "documentId",
  sv."approvedDate" AS "approvedDate",
  sv."auditDate" AS "auditDate",
  sv."authorId" AS "authorId",
  sv."verifierId" AS "verifierId",
  sv."version" AS "version",
  test.id AS "testId",
  COALESCE(
    (
      SELECT json_agg(json_build_object('id', t.id, 'name', t.name))
      FROM "tagToSkills" tts
      JOIN tags t ON tts."tagId" = t.id
      WHERE tts."skillId" = s.id
    ), '[]'
  ) AS "tags"
FROM skills s
JOIN latest_versions lv ON lv."skillId" = s.id
JOIN "skillVersions" sv ON sv."skillId" = s.id AND sv."version" = lv.max_version
LEFT JOIN LATERAL (
  SELECT test.id
  FROM tests test
  WHERE test."skillVersionId" = sv.id
  ORDER BY test.id DESC
  LIMIT 1
) test ON TRUE
WHERE s."isActive" = TRUE
  AND (sv."authorId" = :userId OR sv."verifierId" = :userId)
ORDER BY s."title";
