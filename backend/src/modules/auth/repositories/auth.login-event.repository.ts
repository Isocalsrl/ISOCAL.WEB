import type {
    Pool,
    PoolClient,
} from "pg";

import {
    db,
} from "../../../database/db.js";

import {
    toLoginEvent,
    type LoginEventRow,
} from "../auth.mapper.js";

import type {
    CreateLoginEventInput,
    LoginEvent,
} from "../auth.types.js";

type Queryable = Pick<
    Pool | PoolClient,
    "query"
>;

export async function recordLoginEvent(
    input: CreateLoginEventInput,
    queryable: Queryable = db,
): Promise<void> {
    await queryable.query(
        `
            INSERT INTO admin_login_events (
                admin_id,
                attempted_email,
                outcome,
                ip_address,
                user_agent
            )
            VALUES ($1, $2, $3, $4, $5)
        `,
        [
            input.adminId,
            input.attemptedEmail,
            input.outcome,
            input.ipAddress,
            input.userAgent,
        ],
    );
}

export async function findRecentLoginEvents(
    limit = 100,
): Promise<LoginEvent[]> {
    const result =
        await db.query<LoginEventRow>(
            `
                SELECT
                    events.id,
                    events.admin_id,
                    admins.name AS admin_name,
                    events.attempted_email,
                    events.outcome,
                    events.ip_address,
                    events.user_agent,
                    events.occurred_at
                FROM admin_login_events AS events
                LEFT JOIN admins
                    ON admins.id = events.admin_id
                ORDER BY
                    events.occurred_at DESC,
                    events.id DESC
                LIMIT $1
            `,
            [limit],
        );

    return result.rows.map(
        toLoginEvent,
    );
}
