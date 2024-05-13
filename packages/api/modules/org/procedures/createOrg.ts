import { OrgSchema, db } from "database";
import { z } from "zod";
import { publicProcedure } from "../../../trpc/base";

export const createOrgs = publicProcedure
    .input(z.object({
        org_name: z.string(),
        org_address: z.string(),
        org_contact_number: z.string()
    }))
    .output(OrgSchema)
    .mutation(async ({ input: { org_address, org_contact_number, org_name }, ctx: { abilities } }) => {
        const existingOrg = await db.org.findFirst({
            where: {
                org_name: {
                    equals: org_name,
                    mode: 'insensitive'
                }
            }
        });

        if (existingOrg) {
            throw new Error("Organization name already exists.");
        }

        const orgs = await db.org.create({
            data: {
                org_address,
                org_contact_number,
                org_name,
                status: 'true'
            }
        });
        return orgs;
    });