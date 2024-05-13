import { TRPCError } from "@trpc/server";
import { LuciaError, auth } from "auth";
import { UserSchema } from "database";
import { z } from "zod";
import { publicProcedure } from "../../../trpc/base";

export const loginWithPassword = publicProcedure
  .input(
    z.object({
      email: z
        .string()
        .email()
        .min(1)
        .max(255)
        .transform((v) => v.toLowerCase()),
      password: z.string().min(8).max(255),
    }),
  )
  .output(
    z.object({
      sessionId: z.string(),
      user: UserSchema.pick({
        id: true,
        email: true,
        name: true,
        role: true,
        avatar_url: true,
      }).partial({
        avatar_url: true,
      }),
    }),
  )
  .mutation(
    async ({ input: { email, password }, ctx: { responseHeaders } }) => {
      try {
        const key = await auth.useKey("email", email, password);
        const session = await auth.createSession({
          userId: key.userId,
          attributes: {},
        });

        // auth.handleRequest(req);
        const sessionCookie = auth.createSessionCookie(session);
        responseHeaders?.append("Set-Cookie", sessionCookie.serialize());

        return session;
      } catch (e) {
        if (
          e instanceof LuciaError &&
          (e.message === "AUTH_INVALID_KEY_ID" ||
            e.message === "AUTH_INVALID_PASSWORD")
        )
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Incorrect email or password.",
          });

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "An unknown error occurred.",
        });
      }
    },
  );
