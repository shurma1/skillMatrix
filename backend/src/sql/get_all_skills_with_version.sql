WITH latest_confirmation AS (
  SELECT
    ucs.*,
    ROW_NUMBER() OVER (PARTITION BY ucs."userId", ucs."skillId" ORDER BY ucs."date" DESC, ucs."id" DESC) as rn
  FROM "userToConfirmSkills" ucs
),
latest_skill_versions AS (
  SELECT
    "skillId",
    MAX(version) as version
  FROM "skillVersions"
  GROUP BY "skillId"
)
SELECT
  s.id AS "skillId",
  s.title,
  s."isActive",
  s."documentId",
  sv.version,
  sv."approvedDate",
  sv."auditDate",
  sv."authorId",
  sv."verifierId",
  s.type,
  0 AS level,
  0 AS "targetLevel",
  false AS "isConfirmed",
  false AS "isNew",
  test.id AS "testId",
  COALESCE(
    (
      SELECT json_agg(json_build_object('id', t.id, 'name', t.name))
      FROM "tagToSkills" tts
      JOIN tags t ON tts."tagId" = t.id
      WHERE tts."skillId" = s.id
    ), '[]'
  ) AS tags,
  NULL AS "userId",
  NULL AS login,
  NULL AS firstname,
  NULL AS lastname,
  NULL AS patronymic,
  NULL AS "avatarId"
FROM skills s
LEFT JOIN latest_skill_versions lsv ON lsv."skillId" = s.id
LEFT JOIN "skillVersions" sv ON sv."skillId" = s.id AND sv.version = lsv.version
LEFT JOIN LATERAL (
  SELECT test.id
  FROM tests test
  WHERE test."skillVersionId" = sv.id
  ORDER BY test.id DESC
  LIMIT 1
) test ON TRUE
WHERE s."isActive" = true
