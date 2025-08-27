WITH latest_confirmation AS (
  SELECT
    ucs.*,
    ROW_NUMBER() OVER (PARTITION BY ucs."userId", ucs."skillId" ORDER BY ucs."date" DESC, ucs."id" DESC) as rn
  FROM "userToConfirmSkills" ucs
)
SELECT
  uts."skillId",
  s.title,
  s."isActive",
  s.type,
  COALESCE(ucs.level, 0) AS level,
  uts."targetLevel",
  CASE WHEN ucs.level >= uts."targetLevel" THEN true ELSE false END AS "isConfirmed",
  CASE WHEN usv.version = last_sv.version THEN false ELSE true END AS "isNew",
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
  u.id AS "userId",
  u.login,
  u.firstname,
  u.lastname,
  u.patronymic,
  u.avatar_id AS "avatarId"
FROM "userToSkills" uts
JOIN skills s ON uts."skillId" = s.id
JOIN users u ON uts."userId" = u.id
LEFT JOIN latest_confirmation ucs
  ON ucs."userId" = uts."userId" AND ucs."skillId" = uts."skillId" AND ucs.rn = 1
LEFT JOIN LATERAL (
  SELECT usv.version
  FROM "userSkillViews" usv
  WHERE usv."userId" = uts."userId" AND usv."skillId" = uts."skillId"
  ORDER BY usv.version DESC
  LIMIT 1
) usv ON TRUE
LEFT JOIN (
  SELECT "skillId", MAX(version) as version
  FROM "skillVersions"
  GROUP BY "skillId"
) sv ON sv."skillId" = s.id
LEFT JOIN LATERAL (
  SELECT sv.id, sv.version, sv."auditDate", sv."approvedDate"
  FROM "skillVersions" sv
  WHERE sv."skillId" = s.id
  ORDER BY sv.version DESC
  LIMIT 1
) last_sv ON TRUE
LEFT JOIN LATERAL (
  SELECT test.id
  FROM tests test
  WHERE test."skillVersionId" = last_sv.id
  ORDER BY test.id DESC
  LIMIT 1
) test ON TRUE
WHERE uts."userId" = :userId;
