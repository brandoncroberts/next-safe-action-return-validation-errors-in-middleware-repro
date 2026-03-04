"use server";

import { returnValidationErrors } from "next-safe-action";
import { z } from "zod";
import { actionClient } from "@/lib/safe-action";

const schema = z.object({
  username: z.string().min(3).max(10),
});

export const loginUser = actionClient
  .use(async ({ next }) => {
    try {
      return await next();
    } catch (e) {
      if (e instanceof Error && e.message.startsWith("VALIDATION:")) {
        const message = e.message.replace("VALIDATION:", "");
        return returnValidationErrors(schema, { _errors: [message] });
      }
      throw e;
    }
  })
  .inputSchema(schema)
  .action(async ({ parsedInput: { username } }) => {
    if (username === "taken") {
      throw new Error("VALIDATION:Username is already taken");
    }
    return { success: `Welcome, ${username}!` };
  });
