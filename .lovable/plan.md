

# Upgrade ROFTCO System Prompt Intelligence

## What Changes
Single file edit: `src/lib/groq.ts` — rewrite the `SYSTEM_PROMPT` constant.

## New System Prompt Rules

The current prompt is a single generic sentence. Replace it with a detailed multi-rule prompt that instructs the model to:

1. **Contextual Role** — Generate specialized roles like "Food Tech Solution Architect" or "EdTech Platform Engineer" based on the domain of the idea, not generic "Application Developer."

2. **No Generic Tech Stacks** — Tailor the Tech Stack to the project type:
   - Simple landing page → Astro, HTML/CSS, or static site generators
   - Mobile game → Unity, Godot, React Native
   - Real-time app → Elixir, Go, Socket.io, WebSockets
   - Data-heavy app → Python, FastAPI, PostgreSQL
   - Only default to Next.js + Supabase + Tailwind if it genuinely fits

3. **Feature Expansion** — Act as a product manager. Go beyond what the user typed. If user says "Attendance App," expand with ideas like NFC/QR scanning, geo-fencing, automated weekly reports, calendar integration. Always add 3-5 features the user didn't mention but would need.

4. **Relevant Constraints** — Generate project-specific constraints like "Must work offline in rural areas," "Support 10,000 concurrent users," or "Compliant with Malaysia's PDPA." No generic "secure data handling."

5. **Bilingual → English** — All Malay/Rojak input must be transformed into professional English technical language in every field.

6. **Output Format field** — Make it specific to the deliverable type (API spec, Figma prototype, deployed PWA, etc.) rather than generic "working web app."

## No Other Files Changed
UI, API call logic, and parsing remain untouched.

