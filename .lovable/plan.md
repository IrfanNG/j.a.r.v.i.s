

# Secure API Key via Environment Variable

## Important Note
Lovable does not support `.env` files. The API key needs to be stored as a **runtime secret** using Lovable's secrets management. However, since Vite requires `VITE_` prefixed env vars to be available at **build time** (they're inlined into the client bundle), this approach has a limitation: `import.meta.env.VITE_GROQ_API_KEY` would expose the key in the built JavaScript anyway.

**Recommendation:** Since this is a client-side app calling Groq directly from the browser, the API key will always be visible in network requests regardless of how it's stored. The current approach (hardcoded default + localStorage override) is functionally equivalent in terms of security. To truly secure the key, you'd need a backend proxy (Supabase Edge Function).

## Proposed Changes (as requested)

### 1. `src/lib/groq.ts` — Use env var, remove localStorage helpers
- Replace `getApiKey()` / `setApiKey()` with `import.meta.env.VITE_GROQ_API_KEY`
- Remove `STORAGE_KEY`, `DEFAULT_KEY`, `getApiKey`, `setApiKey` exports
- Update `generateWithGroq` to accept no apiKey param, read from env internally

### 2. `src/pages/Index.tsx` — Remove Settings modal & simplify
- Remove `SettingsModal` import and `<SettingsModal />` from header
- Remove `getApiKey` import and the API key check block
- Pass no apiKey to `generateWithGroq`

### 3. Delete `src/components/SettingsModal.tsx`

### 4. `.gitignore` — Already covers `*.local` (line 13), so `.env.local` is already ignored

### 5. Secret setup
- After implementation, I'll guide you to add `VITE_GROQ_API_KEY` as a **build secret** in Workspace Settings so it's available during build via `import.meta.env`

