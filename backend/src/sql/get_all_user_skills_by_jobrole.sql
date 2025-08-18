SELECT
  s.id AS "skillId",
  s.title,
  s.type,
  COALESCE(ucs.level, 0) AS level,
  jrts."targetLevel",
  CASE WHEN ucs.level >= jrts."targetLevel" THEN true ELSE false END AS "isConfirmed",
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
  utjr."userId" AS "userId",
  u.login,
  u.firstname,
  u.lastname,
  u.patronymic,
  u.avatar_id AS "avatarId"
FROM "userToJobRoles" utjr
JOIN "jobRoleToSkills" jrts ON jrts."jobRoleId" = utjr."jobRoleId"
JOIN skills s ON jrts."skillId" = s.id
JOIN users u ON utjr."userId" = u.id
LEFT JOIN (
  SELECT DISTINCT ON ("userId", "skillId")
    *
  FROM "userToConfirmSkills"
  ORDER BY "userId", "skillId", date DESC
) ucs
  ON ucs."userId" = utjr."userId" AND ucs."skillId" = s.id
LEFT JOIN (
  SELECT DISTINCT ON ("userId", "skillId")
    *
  FROM "userSkillViews"
  ORDER BY "userId", "skillId", version DESC
) usv
  ON usv."userId" = utjr."userId" AND usv."skillId" = s.id
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
WHERE utjr."userId" = :userId
  AND utjr."jobRoleId" = :jobRoleId
