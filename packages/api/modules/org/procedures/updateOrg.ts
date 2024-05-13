import { db } from "database";
import { z } from "zod";
import { publicProcedure } from "../../../trpc/base";

export const updateOrgs = publicProcedure
    .input(z.object({
        org_id: z.number(),
        org_name: z.string(),
        org_address: z.string(),
        org_contact_number: z.string(),
        status: z.string()
    }))
    .output(z.any()).mutation(async ({ input: { org_id, org_address, org_contact_number, org_name, status }, ctx: { abilities } }) => {
        // if (!abilities.isAdmin) {
        //     throw Error("Youre not authorized to edit orgs")
        // }
        if (status === 'false') {
            const orgsInDept = await db.department.findMany({
                where: {
                    org_id: org_id
                }
            });
            const orgsInDesig = await db.designation.findMany({
                where: {
                    org_id: org_id
                }
            });
            const orgsInEmp = await db.employee.findMany({
                where: {
                    org_id: org_id
                }
            });
            if (orgsInDept.length > 0 || orgsInDesig.length > 0 || orgsInEmp.length > 0) {
                throw Error("You're not allowed to change the status to false as it has entities mapped to it")
            }
        }
        const orgs = await db.org.update({
            data: {
                org_address,
                org_contact_number,
                org_id,
                org_name,
                status
            },
            where: {
                org_id
            }
        })
        return orgs
    });