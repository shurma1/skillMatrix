SELECT
  uts."skillId",
  s.title,
  s.type,
  COALESCE(ucs.level, 0) AS level,
  uts."targetLevel",
  CASE WHEN ucs.level >= uts."targetLevel" THEN true ELSE false END AS "isConfirmed",
  CASE WHEN usv.version = sv.version THEN false ELSE true END AS "isNew",
  test.id AS "testId",
  COALESCE(
    (
      SELECT json_agg(json_build_object('id', t.id, 'name', t.name))
      FROM "tagToSkills" tts
      JOIN tags t ON tts."tagId" = t.id
      WHERE tts."skillId" = s.id
    ), '[]'
  ) AS tags,
  COALESCE(
    (
      SELECT json_agg(
        json_build_object(
          'type', ucs2.type,
          'level', ucs2.level,
          'date', ucs2.date,
          'version', ucs2.version
        )
      )
      FROM "userToConfirmSkills" ucs2
      WHERE ucs2."userId" = uts."userId" AND ucs2."skillId" = uts."skillId"
    ), '[]'
  ) AS confirmations,
  u.id AS "userId",
  u.login,
  u.firstname,
  u.lastname,
  u.patronymic
FROM "userToSkills" uts
JOIN skills s ON uts."skillId" = s.id
JOIN users u ON uts."userId" = u.id
LEFT JOIN "userToConfirmSkills" ucs
  ON ucs."userId" = uts."userId" AND ucs."skillId" = uts."skillId"
LEFT JOIN "userSkillViews" usv
  ON usv."userId" = uts."userId" AND usv."skillId" = uts."skillId"
LEFT JOIN LATERAL (
  SELECT sv.id, sv.version
  FROM "skillVersions" sv
  WHERE sv."skillId" = s.id
  ORDER BY sv.version DESC
  LIMIT 1
) last_sv ON TRUE
LEFT JOIN tests test ON test."skillVersionId" = last_sv.id
WHERE uts."userId" = :userId AND uts."skillId" = :skillId
LIMIT 1
