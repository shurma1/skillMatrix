WITH latest_confirmation AS (
  SELECT
    ucs.*,
    ROW_NUMBER() OVER (
      PARTITION BY ucs."userId", ucs."skillId"
      ORDER BY ucs."date" DESC, ucs."id" DESC
    ) as rn
  FROM "userToConfirmSkills" ucs
)
SELECT
  uts."skillId",
  s.title,
  s.type,
  COALESCE(ucs.level, 0) AS level,
  uts."targetLevel",
  CASE WHEN ucs.level >= uts."targetLevel" THEN true ELSE false END AS "isConfirmed",
  CASE WHEN usv.version = last_sv.version THEN false ELSE true END AS "isNew",
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
  u.avatar_id AS "avatarId"  -- Добавлено поле avatarId
FROM "userToSkills" uts
JOIN skills s ON uts."skillId" = s.id
JOIN users u ON uts."userId" = u.id
LEFT JOIN latest_confirmation ucs
  ON ucs."userId" = uts."userId" AND ucs."skillId" = uts."skillId" AND ucs.rn = 1
LEFT JOIN "userSkillViews" usv
  ON usv."userId" = uts."userId" AND usv."skillId" = uts."skillId"
LEFT JOIN (
  SELECT "skillId", MAX(version) as version
  FROM "skillVersions"
  GROUP BY "skillId"
) sv ON sv."skillId" = s.id
LEFT JOIN LATERAL (
  SELECT sv.id, sv.version
  FROM "skillVersions" sv
  WHERE sv."skillId" = s.id
  ORDER BY sv.version DESC
  LIMIT 1
) last_sv ON TRUE
LEFT JOIN tests test ON test."skillVersionId" = last_sv.id
WHERE uts."skillId" = :skillId
