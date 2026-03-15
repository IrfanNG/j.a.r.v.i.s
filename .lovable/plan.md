

# Fix: Force Real Gemini API — No Silent Fallback

## Problem
The API key's quota is exhausted (429 error). The catch block silently falls back to mock data showing "FALLBACK ACTIVE". The user wants: no mock fallback on generate, better error messages, and console logging.

## Changes

### 1. `src/pages/Index.tsx` — Remove mock fallback in catch block
- Remove the `try { generateMockROFTCO } catch` fallback inside the error handler
- On API failure, parse the error for 429 (quota) vs 401/403 (auth) and show specific HUD errors:
  - 429 → "SYSTEM OVERHEAT — Rate limit exceeded. Retry in a moment."
  - 401/403 → "ACCESS DENIED — Invalid API key. Check Settings."
  - Other → "SYSTEM ERROR — Connection failed."
- Set status to `"error"` — no fallback to mock
- Add `console.log("J.A.R.V.I.S. Engine: API Key detected")` before API call
- Add `console.log("J.A.R.V.I.S. Engine: Connecting to Gemini...")` when calling API
- Keep the `if (apiKey)` branch but remove the `else` mock branch (since `getApiKey()` always returns a key)

### 2. `src/lib/gemini.ts` — Better error info
- In the error thrown from `generateWithGemini`, include the HTTP status code in a parseable way so Index.tsx can distinguish 429 vs 401

### 3. Startup notification
- On boot complete, show a cyan "J.A.R.V.I.S. ONLINE" toast confirming the engine is active

### No `@google/generative-ai` needed
The current `fetch`-based approach works fine and avoids an unnecessary dependency. The real issue is the quota on the provided key — the code correctly calls Gemini, it just gets rate-limited. These changes ensure the user sees clear errors instead of silent fallback.

