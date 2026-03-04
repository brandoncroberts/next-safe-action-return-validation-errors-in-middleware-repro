# next-safe-action `returnValidationErrors` in middleware bug repro

Minimal reproduction for a bug where `returnValidationErrors` called from a **middleware catch block** throws an unhandled `ActionServerValidationError` instead of returning `{ validationErrors: ... }` to the client.

## Affected versions

This bug was introduced **after version 8.0.1**. Version 8.0.1 works correctly. Versions 8.0.2+ (including latest 8.1.4) are affected.

## The bug

When `handleServerError` is configured to **rethrow** (a [documented pattern](https://next-safe-action.dev/docs/define-actions/create-the-client#handleservererror)), and a middleware wraps `next()` in a try/catch to convert domain errors into validation errors via `returnValidationErrors`, the action throws instead of returning validation errors.

### Client error (browser console)

```
Error: Server Action server validation error(s) occurred
    at handleSafeActionUniqueError (error.ts:8:34)
    at <anonymous> (client.ts:118:43)
    at <anonymous> (client.ts:71:22)
    at <anonymous> (client.ts:55:11)
```

### Server error (terminal)

```
⨯ Error: Server Action server validation error(s) occurred
    at returnValidationErrors (validation-errors.ts)
    at <middleware catch block>
```

## Reproduce

```bash
pnpm install
pnpm dev
```

1. Open http://localhost:3000
2. Click "Login" (username defaults to `taken`)
3. **Expected:** result shows `{ validationErrors: { _errors: ["Username is already taken"] } }`
4. **Actual:** caught error "Server Action server validation error(s) occurred"

Check server terminal for the stack trace.

## Root cause

In `action-builder.ts`, the `serverErrorHandled` guard fires **before** the `instanceof ActionServerValidationError` check, causing the validation error to be re-thrown as an unhandled exception when `handleServerError` has already processed (and re-thrown) the original domain error.

## Versions

- next-safe-action: 8.1.4 (bug present in 8.0.2+, works in 8.0.1)
- next: 16.x
- zod: 4.x
