import { TRPCError } from "@trpc/server";
import { auth, validateOneTimePassword } from "auth";
import { UserOneTimePasswordTypeSchema } from "database";
import { z } from "zod";
import { publicProcedure } from "../../../trpc/base";

export const verifyOtp = publicProcedure
  .input(
    z.object({
      type: UserOneTimePasswordTypeSchema,
      identifier: z.string(),
      code: z.string(),
    }),
  )
  .mutation(
    async ({ input: { type, identifier, code }, ctx: { responseHeaders } }) => {
      try {
        const userId = await validateOneTimePassword({
          type,
          identifier,
          code,
        });

        const session = await auth.createSession({
          userId: userId,
          attributes: {},
        });

        if (!session.user.email_verified) {
          await auth.updateUserAttributes(session.user.id, {
            email_verified: true,
          });
        }

        // auth.handleRequest(req);
        const sessionCookie = auth.createSessionCookie(session);
        responseHeaders?.append("Set-Cookie", sessionCookie.serialize());

        return session;
      } catch (e) {
        console.error(e);

        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid one-time password",
        });
      }
    },
  );
