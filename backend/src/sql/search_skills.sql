WITH latest_versions AS (
    SELECT
        sv."skillId",
        MAX(sv."version") AS max_version
    FROM "skillVersions" sv
    GROUP BY sv."skillId"
),
skills_with_latest AS (
    SELECT
        s."id" AS "skillId",
        s."type",
        s."title",
        s."isActive",
        sv."approvedDate",
        sv."auditDate",
        sv."authorId",
        sv."verifierId",
        sv."version"
    FROM "skillVersions" sv
    JOIN latest_versions lv
        ON sv."skillId" = lv."skillId" AND sv."version" = lv.max_version
    JOIN "skills" s
        ON sv."skillId" = s."id" AND s."isActive" = TRUE
)
SELECT
    swl."skillId" AS "id",
    swl."type",
    swl."title",
    swl."isActive",
    swl."approvedDate",
    swl."auditDate",
    swl."authorId",
    swl."verifierId",
    swl."version",
    test."id" AS "testId",
    COALESCE(
        JSON_AGG(
            DISTINCT JSONB_BUILD_OBJECT(
                'id', t."id",
                'name', t."name"
            )
        ) FILTER (WHERE t."id" IS NOT NULL),
        '[]'
    ) AS tags
FROM skills_with_latest swl
LEFT JOIN "tagToSkills" tts ON tts."skillId" = swl."skillId"
LEFT JOIN "tags" t ON t."id" = tts."tagId"
LEFT JOIN "tests" test ON test."skillVersionId" = swl."id"
WHERE
    (:query IS NULL OR swl."title" ILIKE :query OR swl."type" ILIKE :query)
    AND (:authorIds IS NULL OR swl."authorId" = ANY(:authorIds))
    AND (:verifierIds IS NULL OR swl."verifierId" = ANY(:verifierIds))
    AND (
        :approvedDateStart IS NULL OR :approvedDateEnd IS NULL
        OR (swl."approvedDate" BETWEEN :approvedDateStart AND :approvedDateEnd)
    )
    AND (
        :auditDateStart IS NULL OR :auditDateEnd IS NULL
        OR (swl."auditDate" BETWEEN :auditDateStart AND :auditDateEnd)
    )
    AND (
        :tags IS NULL
        OR :tags = '{}'
        OR t."id" = ANY(:tags)
    )
GROUP BY
    swl."skillId",
    swl."type",
    swl."title",
    swl."isActive",
    swl."approvedDate",
    swl."auditDate",
    swl."authorId",
    swl."verifierId",
    swl."version",
    test."id"
HAVING
    (:tags IS NULL OR :tags = '{}' OR COUNT(DISTINCT t."id") >= 1)
