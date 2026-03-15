

# J.A.R.V.I.S. — Phase 1 Implementation Plan

## Vision
A tactical prompt-engineering HUD that converts messy ideas into structured ROFTCO prompts, wrapped in an Iron Man / Stark Industries aesthetic — true black, cyan data lines, hot rod red actions, zero rounded corners.

## Core Pages & Flow

### Landing / Main Interface (Single Page App)
1. **Boot Sequence** — On load, a scan-line animation sweeps top-to-bottom, "SYSTEM READY" flickers in the corner, then the main HUD fades in
2. **Brain Dump Input** — A large monospace textarea (JetBrains Mono + Inter for content) with cyan border glow on focus, "AWAITING INPUT" placeholder, supports English/Malay/Rojak
3. **"Initiate Protocol" Button** — Hot Rod Red (#C8102E), centered below input. On click, triggers Arc Reactor spin animation (SVG rotating ring via Framer Motion)
4. **ROFTCO Output HUD** — 6 HUD-styled panels in a responsive grid (3×2 on desktop, 1-col on mobile), each with corner brackets, uppercase label, typewriter text reveal:
   - Role / Objective / Features / Tech Stack / Constraint / Output Format
5. **"Deploy Protocol" Button** — Copies assembled prompt to clipboard, triggers cyan screen flash + military-style toast notification

## Design System Updates
- **Colors**: Background #000000, Foreground/Border cyan #00FFFF, Primary #C8102E
- **Typography**: JetBrains Mono (Google Fonts) for all UI labels, Inter for content text
- **Border radius**: 0px globally — no rounded corners anywhere
- **No box-shadows** — only cyan drop-shadow glows on active elements
- **Scan-line overlay** — CSS pseudo-element with repeating gradient

## Key Components
- **HUDCard** — Reusable panel with corner brackets, label, typewriter content animation
- **ArcReactorSpinner** — SVG arc segments rotating via Framer Motion during processing
- **ScanLineOverlay** — Fixed full-screen scan-line effect
- **StatusIndicator** — "SYSTEM READY" / "PARSING NEURAL DUMP..." / "SEQUENCE COMPLETE" state text

## AI Integration
- Connect to **Lovable AI** (Gemini) via an edge function to parse brain dump input into ROFTCO structure
- System prompt instructs the model to return structured Role/Objective/Features/Tech Stack/Constraint/Output Format
- Uses tool calling for structured JSON extraction
- Streaming response with typewriter effect on each HUD panel

## Animations (Framer Motion)
- Boot sequence fade-in with staggered children
- Arc Reactor spin on processing (`rotate: 360`, repeating)
- Typewriter character-by-character reveal on ROFTCO panels
- Cyan flash on "Deploy Protocol" click
- Input border glow transition on focus

## Responsive Behavior
- Desktop: 3-column grid for ROFTCO panels
- Tablet: 2-column grid
- Mobile: Single column stack, full-width input and buttons

