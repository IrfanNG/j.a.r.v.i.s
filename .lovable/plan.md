

# Replace Gemini with Groq API (Llama 3)

## Changes

### 1. `src/lib/gemini.ts` → Rewrite as `src/lib/groq.ts`
- Replace Gemini endpoint with `https://api.groq.com/openai/v1/chat/completions`
- Model: `llama-3.1-8b-instant`
- Use OpenAI-compatible chat format: system message + user message
- Auth via `Authorization: Bearer <key>` header
- Parse `response.choices[0].message.content` as JSON
- Storage key changes to `jarvis-groq-api-key`
- Default key: the provided `gsk_...` key
- Migrate old Gemini keys automatically
- Export `generateWithGroq`, `getApiKey`, `setApiKey`

### 2. `src/pages/Index.tsx`
- Import from `@/lib/groq` instead of `@/lib/gemini`
- Call `generateWithGroq` instead of `generateWithGemini`
- Update "NO API KEY" toast to reference Groq instead of Gemini

### 3. `src/components/SettingsModal.tsx`
- Import from `@/lib/groq`
- Change label from "Gemini API Key" to "Groq API Key"
- Update help link to `console.groq.com/keys`

### 4. Delete `src/lib/gemini.ts`

No UI/styling changes. The Groq API key is a publishable client-side key, so storing it in code is acceptable per project guidelines.

