

# Fix: Expired API Key + Better Error Handling

## Root Cause
The hardcoded default API key (`AIzaSyDD4S3f1UgbSizIXwhJFEr1cNO0wUqRBV0`) is **expired**. Gemini returns HTTP 400 with `"API key expired. Please renew the API key."` The current error handler only checks for 429/401/403, so 400 falls into the generic "SYSTEM ERROR" bucket — hiding the real reason.

## Changes

### 1. `src/lib/gemini.ts` — Update model + remove expired default key
- Change model from `gemini-2.0-flash` to `gemini-1.5-flash` (more stable endpoint)
- Remove the expired hardcoded default key — `getApiKey()` returns empty string if none stored
- Keep using `fetch` (no need for `@google/generative-ai` SDK)

### 2. `src/pages/Index.tsx` — Better error handling + key validation
- Before calling API, check if `getApiKey()` is empty — if so, show warning toast: "No API key configured. Open Settings to add your Gemini key." and abort
- Add 400 status handling: parse the error body for `API_KEY_INVALID` or `API_KEY_EXPIRED` and show "ACCESS DENIED — API key expired. Get a new one at aistudio.google.com"
- Show the actual `error.message` in the toast description so the user sees the exact failure reason

### 3. `src/components/SettingsModal.tsx` — Minor UX
- Add `DialogDescription` to fix the accessibility warning in console

## No UI changes
All Stark Industries styling stays identical. Only the API logic and error messages change.

