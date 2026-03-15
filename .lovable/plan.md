

# Production Polish for KD x UniKL Builders

## Changes

### 1. Animated Scan Line (`ScanLineOverlay.tsx` + `index.css`)
- Replace static scan-line overlay with an animated sweeping line that moves vertically on a loop
- Add a CSS `@keyframes scan-move` animation (top to bottom, 4s infinite) for a single bright cyan line that travels over the existing static scanlines

### 2. Glow on Populated HUD Cards (`HUDCard.tsx`)
- When `content` is non-empty, apply the `border-glow-cyan` class to the card container
- Animate glow in via Framer Motion on mount

### 3. Pulse Animation on "Initiate Protocol" Button (`Index.tsx` + `tailwind.config.ts`)
- Add a `pulse-glow` keyframe in Tailwind config (subtle scale + box-shadow pulse)
- Conditionally apply `animate-pulse-glow` class to the button when `input.trim()` is non-empty and not processing

### 4. Ghost Text / Rotating Placeholder (`Index.tsx`)
- Create rotating placeholder text array: `["App jual nasi lemak...", "UniKL student house hunting app...", "Travel planner for Cuti-Cuti Malaysia...", "Borang kehadiran pelajar..."]`
- Use `useState` + `useEffect` with `setInterval` (3s) to cycle through examples
- Render as faded overlay text inside the textarea container (positioned absolutely, hidden when user has typed input)

### 5. Update System Prompt for Modern Tech Stack (`groq.ts`)
- Change default tech stack in SYSTEM_PROMPT from "React, Vite, Tailwind CSS, TypeScript, Supabase" to "Next.js, Supabase, Tailwind CSS, TypeScript"
- Add instruction: "Keep the Tech Stack strictly modern unless the user explicitly specifies otherwise."

### 6. Footer Branding Update (`Index.tsx`)
- Update footer text from "Stark Industries — Internal Use Only" to "Stark Industries × KD x UniKL Builders"

