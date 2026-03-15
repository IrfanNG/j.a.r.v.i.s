

# J.A.R.V.I.S. Phase 1 — Pure Frontend Fix

## Problem
Build error: `@/integrations/supabase/client` doesn't exist. The user wants zero cloud dependencies.

## Plan

1. **Remove Supabase import** from `Index.tsx` and replace the `supabase.functions.invoke` call with a local mock function.

2. **Create `src/lib/mock-roftco.ts`** — A frontend function that parses the user's brain dump text using keyword matching and template logic to produce a `ROFTCOData` object. It will:
   - Extract keywords to guess role, tech stack, constraints
   - Use sensible defaults/templates for any missing fields
   - Add a small `setTimeout` delay (1-2s) to simulate processing
   - Return structured ROFTCO JSON

3. **Update `Index.tsx`**:
   - Remove supabase import
   - Import and call the mock generator instead
   - Keep all existing HUD UI, animations, and copy logic unchanged

4. **Fix `useState` misuse** — Line 51 uses `useState()` as an effect. Replace with `useEffect` for the boot timer.

No other files need changes. All animations, components, and styling remain as-is.

