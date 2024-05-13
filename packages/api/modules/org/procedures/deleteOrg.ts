import { db } from "database";
import { z } from "zod";
import { publicProcedure } from "../../../trpc/base";

export const deleteOrgs = publicProcedure
    .input(z.object({
        org_id: z.number(),
    }))
    .output(z.string())
    .mutation(async ({ input: { org_id }, ctx: { abilities } }) => {
        // if (!abilities.isAdmin) {
        //     throw Error("Youre not authorized to create orgs")
        // }
        const orgs = await db.org.deleteMany({
            where: {
                org_id
            }
        })
        return "Successfully deleted"
    });