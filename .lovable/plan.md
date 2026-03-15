

# J.A.R.V.I.S. Phase 2 — Gemini AI Integration

## Overview
Replace the mock ROFTCO generator with real Gemini API calls, add a Settings modal for API key management, and enhance error/loading states.

## Changes

### 1. Create `src/lib/gemini.ts` — Gemini API client
- Export `generateROFTCO(input: string, apiKey: string): Promise<ROFTCOData>`
- Use `fetch` to call `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent`
- System prompt instructs the model to:
  - Accept any language (English, Malay, Rojak)
  - Output strictly in professional English
  - Return JSON with keys: `role`, `objective`, `features`, `techStack`, `constraint`, `outputFormat`
  - Default to modern vibe-coder stack (Vite, React, Tailwind, Supabase) when no tech is specified
- Parse the JSON from the response, with fallback to mock generator if parsing fails
- No npm package needed — plain `fetch`

### 2. Create `src/components/SettingsModal.tsx` — API Key settings
- HUD-styled Dialog (using existing shadcn Dialog component)
- Single input field for Gemini API key, masked by default with show/hide toggle
- Save to `localStorage` key `jarvis-gemini-api-key`
- Pre-populate the provided default key: `AIzaSyDD4S3f1UgbSizIXwhJFEr1cNO0wUqRBV0`
- Settings gear icon button in the header (next to J.A.R.V.I.S. title)
- Styled with cyan borders, black background, mono font — matching existing aesthetic

### 3. Update `src/pages/Index.tsx`
- Add Settings gear icon to header, opening SettingsModal
- Read API key from localStorage on mount
- In `handleGenerate`:
  - If API key exists → call `generateROFTCO` from gemini.ts
  - If no key → fall back to existing mock generator
  - If input is too short (<10 chars) → show gold warning toast
- Enhanced processing status messages: cycle through "ANALYZING DATA...", "STRUCTURING PROTOCOL...", "COMPILING OUTPUT..." during API wait

### 4. Update `src/components/StatusIndicator.tsx`
- Add `"warning"` status type with Metallic Gold (#FFD700) color
- Used for missing API key or short input warnings

### 5. Update `src/lib/mock-roftco.ts`
- Keep as-is — used as fallback when no API key is configured

### 6. Gold warning styling
- Add `--warning: #FFD700` color to the CSS variables
- Warning toasts use gold border/text for "System Warning" messages

## Architecture
```text
User Input → handleGenerate()
                ├─ API key exists? → gemini.ts → Gemini API → parse JSON → ROFTCOData
                └─ No key?         → mock-roftco.ts → template-based → ROFTCOData
```

## No backend, no paid services
- API key stored in localStorage only
- Direct client-side fetch to Gemini API
- Default free-tier key pre-populated

