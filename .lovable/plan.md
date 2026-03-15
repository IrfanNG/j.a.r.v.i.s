

# Fix ROFTCO Data Formatting

## Problem
The `str()` helper in `groq.ts` has two issues:
1. **Objects as JSON** — When the AI returns an object (e.g., for Objective), it falls through to `JSON.stringify`, showing raw JSON in the card.
2. **Double bullets** — When the AI returns an array where items already start with "•", the `str()` function prepends another "•", creating "• • item".

## Changes

### `src/lib/groq.ts` — Improve the `str()` helper (lines 95-100)

Replace the current `str()` function with smarter formatting:

```typescript
const str = (val: unknown): string => {
  if (typeof val === "string") {
    // Clean double bullets from strings
    return val.replace(/•\s*•/g, "•").trim();
  }
  if (Array.isArray(val)) {
    return val
      .map((v) => {
        const s = typeof v === "string" ? v : JSON.stringify(v);
        // Strip existing bullet before adding one
        return `• ${s.replace(/^[•\-\*]\s*/, "").trim()}`;
      })
      .join("\n");
  }
  if (val && typeof val === "object") {
    // Extract meaningful text from objects instead of JSON.stringify
    const obj = val as Record<string, unknown>;
    // If it has a descriptive key, use its value
    const textKeys = ["description", "text", "summary", "content", "value"];
    for (const k of textKeys) {
      if (typeof obj[k] === "string") return obj[k] as string;
    }
    // Otherwise join all string values as a paragraph
    const values = Object.values(obj).filter((v) => typeof v === "string");
    if (values.length) return (values as string[]).join(" ");
    return JSON.stringify(val);
  }
  return String(val ?? "");
};
```

This fixes all three issues:
- **Objects** → extracts readable text instead of dumping JSON
- **Double bullets** → strips existing bullet prefixes before adding one
- **Strings with double bullets** → regex-cleaned on return

No UI or AI prompt changes needed.

