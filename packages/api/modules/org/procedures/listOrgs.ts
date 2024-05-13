import { OrgSchema, db } from "database";
import { z } from "zod";
import { publicProcedure } from "../../../trpc/base";

export const orgs = publicProcedure
    .input(z.void())
    .output(z.array(OrgSchema)).query(async ({ ctx: { abilities } }) => {
        // if (abilities.isAdmin) {
        const orgs = await db.org.findMany({
            orderBy: {
                org_id: 'asc'
            }
        })
        return orgs
        // }
        return [];
    });
