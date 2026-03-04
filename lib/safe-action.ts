import { createSafeActionClient } from "next-safe-action";

// Documented pattern: https://next-safe-action.dev/docs/define-actions/create-the-client
export const actionClient = createSafeActionClient({
  handleServerError(e) {
    console.error("Action error:", e.message);
    throw e;
  },
});
