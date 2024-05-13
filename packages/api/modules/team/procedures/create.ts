import { TRPCError } from "@trpc/server";
import { TeamMemberRoleSchema, TeamSchema, db } from "database";
import { z } from "zod";
import { protectedProcedure } from "../../../trpc/base";
import { slugifyTeamName } from "../lib/team-slug";

export const create = protectedProcedure
  .input(
    z.object({
      name: z.string(),
    }),
  )
  .output(
    TeamSchema.extend({
      memberships: z.array(
        z.object({
          id: z.string(),
          role: TeamMemberRoleSchema,
          is_creator: z.boolean(),
        }),
      ),
    }),
  )
  .mutation(async ({ input: { name }, ctx: { user } }) => {
    let slug = slugifyTeamName(name);

    if (!slug)
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Invalid team name",
      });

    let isSlugAvailable = false;
    let iteration = 0;

    while (!isSlugAvailable) {
      if (iteration === 2)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Could not create team",
        });

      const existingTeam = await db.team.findUnique({
        where: {
          slug,
        },
      });

      if (!existingTeam) isSlugAvailable = true;
      else {
        slug = slugifyTeamName(
          `${name}-${(Math.random() + 1).toString(36).substring(2, 7)}`,
        );
      }
    }

    const team = await db.team.create({
      data: {
        name,
        slug,
        memberships: {
          create: {
            user_id: user!.userId,
            role: TeamMemberRoleSchema.Values.OWNER,
            is_creator: true,
          },
        },
      },
      select: {
        id: true,
        name: true,
        slug: true,
        memberships: {
          select: {
            id: true,
            role: true,
            is_creator: true,
          },
        },
      },
    });

    return team;
  });
