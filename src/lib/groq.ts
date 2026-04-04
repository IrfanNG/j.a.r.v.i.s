import type { ROFTCOData } from "./mock-roftco";

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

const SYSTEM_PROMPT = `You are J.A.R.V.I.S., an elite Solution Architect and Product Strategist. Your task: convert the user's raw idea (in Malay, English, or Bahasa Rojak) into a hyper-specific, production-grade 6-part ROFTCO prompt. Output strictly in raw JSON with keys: role, objective, features, techStack, constraint, outputFormat. No markdown, no code fences.

RULES — follow every one precisely:

1. ROLE (Contextual & Specialized):
   - Never use generic titles like "Application Developer" or "Full-Stack Developer."
   - Derive a domain-specific role from the idea. Examples: "Food Tech Solution Architect," "EdTech Platform Engineer," "FinTech Security Specialist," "AgriTech IoT Systems Designer."

2. OBJECTIVE (Clear & Ambitious):
   - Rewrite the user's messy idea into a precise, professional objective statement.
   - Include the target audience, core value proposition, and desired outcome.

3. FEATURES (Product Manager Expansion):
   - Do NOT just restate what the user typed. Act as a senior product manager.
   - Always include 5-8 features: the user's core idea PLUS 3-5 features they didn't mention but would critically need.
   - Each feature must be a bullet prefixed with "•" and be specific enough to implement.

4. TECH STACK (Tailored, Never Generic):
   - Do NOT default to "Next.js + Supabase + Tailwind" for everything.
   - Always provide the tech stack as a bulleted list prefixed with "•".
   - Each item must include the technology name and a 1-sentence technical justification.
   - Match the stack to the project type.

5. CONSTRAINT (Project-Specific, Not Generic):
   - Generate 2-3 constraints that are specific to the project context. Examples:
     • "Must function offline-first for rural areas"
     • "Must handle 10,000 concurrent users"
     • "Compliant with Malaysia's PDPA 2010"
     • "Must support Bahasa Melayu UI"

6. OUTPUT FORMAT (Specific Deliverable):
   - Specify the exact deliverable type: "Deployed PWA with service worker," "REST API with OpenAPI 3.0 spec," "Figma-to-code responsive prototype," etc.

7. LANGUAGE TRANSFORMATION:
    - All Malay, Rojak, or Manglish input MUST be converted to professional English technical language in every field.
    - Maintain technical precision — "borang" → "form," "hantar" → "submit/deploy," "kedai" → "storefront/marketplace."

Be bold, creative, and deeply technical. Every ROFTCO output should feel like it was written by a world-class consultant, not a template engine.`;

export async function generateWithGroq(
  input: string
): Promise<ROFTCOData> {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY;
  if (!apiKey) {
    throw new Error("VITE_GROQ_API_KEY is not configured. Add it as a build secret in Workspace Settings.");
  }

  const response = await fetch(GROQ_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "llama-3.1-8b-instant",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: input },
      ],
      temperature: 0.7,
      response_format: { type: "json_object" },
    }),
  });

  if (!response.ok) {
    const errBody = await response.text();
    let message = `Groq API error (${response.status})`;
    try {
      const parsed = JSON.parse(errBody);
      message = parsed?.error?.message || message;
    } catch { /* use default message */ }
    const error = new Error(message);
    (error as any).status = response.status;
    throw error;
  }

  const data = await response.json();
  const text = data.choices?.[0]?.message?.content;
  if (!text) throw new Error("Empty response from Groq");

  const parsed = JSON.parse(text);

  const str = (val: unknown): string => {
    if (typeof val === "string") {
      return val.trim();
    }
    if (Array.isArray(val)) {
      return val
        .map((v) => {
          const s = typeof v === "string" ? v : JSON.stringify(v);
          return `• ${s.replace(/^[•\-\*]\s*/, "").trim()}`;
        })
        .join("\n");
    }
    return String(val ?? "");
  };

  const cleanList = (val: unknown): string => {
    if (typeof val === "string") {
      return val
        .replace(/•\s*•/g, "•")
        .replace(/^\s*[\-\*]\s/gm, "• ")
        .trim();
    }
    return str(val);
  }

  return {
    role: str(parsed.role),
    objective: str(parsed.objective),
    features: cleanList(parsed.features),
    techStack: cleanList(parsed.techStack),
    constraint: cleanList(parsed.constraint),
    outputFormat: str(parsed.outputFormat),
  };
}

