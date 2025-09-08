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
        s."documentId",
        sv."approvedDate",
        sv."auditDate",
        sv."authorId",
        sv."verifierId",
        sv."version"
    FROM "skillVersions" sv
    JOIN latest_versions lv
        ON sv."skillId" = lv."skillId" AND sv."version" = lv.max_version
    JOIN "skills" s
        ON sv."skillId" = s."id" -- AND s."isActive" = TRUE
),
base AS (
    SELECT
        swl."skillId" AS "id",
        swl."type",
        swl."title",
        swl."isActive",
        swl."documentId",
        swl."approvedDate",
        swl."auditDate",
        swl."authorId",
        swl."verifierId",
        swl."version",
        test."id" AS "testId",
        COALESCE(
            (
                SELECT JSONB_AGG(
                    JSONB_BUILD_OBJECT(
                        'id', x."id",
                        'name', x."name"
                    )
                    ORDER BY x."createdAt" ASC, x."id" ASC
                )
                FROM (
                    SELECT DISTINCT ON (t0."id")
                        t0."id",
                        t0."name",
                        tts0."createdAt"
                    FROM "tagToSkills" tts0
                    JOIN "tags" t0 ON t0."id" = tts0."tagId"
                    WHERE tts0."skillId" = swl."skillId"
                    ORDER BY t0."id", tts0."createdAt" DESC
                ) AS x
            ),
            '[]'
        ) AS "tags"
    FROM skills_with_latest swl
    LEFT JOIN "tagToSkills" tts ON tts."skillId" = swl."skillId"
    LEFT JOIN "tags" t ON t."id" = tts."tagId"
    LEFT JOIN "tests" test ON test."skillVersionId" = swl."skillId"
    WHERE
        (:query IS NULL OR swl."title" ILIKE :query OR swl."type" ILIKE :query)

        -- authorIds фильтр
        AND (
            :hasAuthorIds::boolean = FALSE
            OR swl."authorId" IN (SELECT CAST(jsonb_array_elements_text(:authorIdsJson) AS uuid))
        )

        -- verifierIds фильтр
        AND (
            :hasVerifierIds::boolean = FALSE
            OR swl."verifierId" IN (SELECT CAST(jsonb_array_elements_text(:verifierIdsJson) AS uuid))
        )

        AND (
            :approvedDateStart IS NULL OR :approvedDateEnd IS NULL
            OR (swl."approvedDate" BETWEEN :approvedDateStart AND :approvedDateEnd)
        )
        AND (
            :auditDateStart IS NULL OR :auditDateEnd IS NULL
            OR (swl."auditDate" BETWEEN :auditDateStart AND :auditDateEnd)
        )

        -- tags фильтр (новый подход)
        AND (
            :hasTagIds::boolean = FALSE
            OR t."id" IN (SELECT CAST(jsonb_array_elements_text(:tagIdsJson) AS uuid))
        )

        -- needRevision фильтр - навыки, которые нуждаются в ревизии (auditDate <= текущая дата + 1 месяц)
        -- Предыдущее условие было инвертировано и отсеивало старые записи, оставляя почти все остальные.
        AND (
            :needRevision::boolean = FALSE
            OR swl."auditDate" <= (CURRENT_DATE + INTERVAL '1 month')
        )
    GROUP BY
        swl."skillId",
        swl."type",
        swl."title",
        swl."isActive",
        swl."documentId",
        swl."approvedDate",
        swl."auditDate",
        swl."authorId",
        swl."verifierId",
        swl."version",
        test."id"
    HAVING
        (:hasTagIds::boolean = FALSE OR COUNT(DISTINCT t."id") >= 1)
),
paged AS (
    SELECT
        b.*,
        COUNT(*) OVER() AS total_count
    FROM base b
    ORDER BY b."approvedDate" DESC, b."title"
    LIMIT COALESCE(:limit, 50)
    OFFSET COALESCE(:offset, 0)
)
SELECT JSONB_BUILD_OBJECT(
    'count', COALESCE(MAX(total_count), 0),
    'rows', COALESCE(JSONB_AGG(
        JSONB_BUILD_OBJECT(
            'id', "id",
            'type', "type",
            'title', "title",
            'isActive', "isActive",
            'documentId', "documentId",
            'approvedDate', "approvedDate",
            'auditDate', "auditDate",
            'authorId', "authorId",
            'verifierId', "verifierId",
            'version', "version",
            'testId', "testId",
            'tags', "tags"
        ) ORDER BY "approvedDate" DESC, "title"
    ), '[]'::jsonb)
) AS result
FROM paged;
