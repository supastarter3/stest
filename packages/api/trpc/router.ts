import type {} from "@prisma/client";
import { inferRouterInputs, inferRouterOutputs } from "@trpc/server";
import * as aiProcedures from "../modules/ai/procedures";
import * as authProcedures from "../modules/auth/procedures";
import * as billingProcedures from "../modules/billing/procedures";
import * as newsletterProcedures from "../modules/newsletter/procedures";
import * as teamProcedures from "../modules/team/procedures";
import * as orgProcedures from "../modules/org/procedures";
import { router } from "./base";

export const apiRouter = router({
  auth: router(authProcedures),
  billing: router(billingProcedures),
  team: router(teamProcedures),
  newsletter: router(newsletterProcedures),
  ai: router(aiProcedures),
  org: router(orgProcedures),
});

export type ApiRouter = typeof apiRouter;
export type ApiInput = inferRouterInputs<ApiRouter>;
export type ApiOutput = inferRouterOutputs<ApiRouter>;
