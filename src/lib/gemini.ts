import type { ROFTCOData } from "./mock-roftco";

const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

const SYSTEM_PROMPT = `You are J.A.R.V.I.S., an advanced AI prompt engineering system. Your task is to take a user's messy "brain dump" (which may be in English, Malay, Rojak, or any mix) and convert it into a structured ROFTCO prompt in professional English.

ROFTCO stands for:
- Role: Who the AI should act as (e.g., "Act as a Senior Frontend Engineer...")
- Objective: What needs to be built, in one clear sentence
- Features: Bullet-pointed list of key features (use "•" prefix)
- Tech Stack: Comma-separated list of technologies. If none mentioned, default to: React, Vite, Tailwind CSS, TypeScript, Supabase
- Constraint: Technical constraints, best practices, limitations
- Output Format: What the final deliverable should look like

Rules:
1. Output MUST be in professional English regardless of input language
2. Be specific and actionable — no vague statements
3. Features should be concrete bullet points, each on a new line prefixed with "•"
4. Tech Stack should suggest modern, easy-to-deploy technologies for vibe coders
5. Return ONLY valid JSON with these exact keys: role, objective, features, techStack, constraint, outputFormat
6. No markdown formatting, no code blocks — just raw JSON`;

export async function generateWithGemini(
  input: string,
  apiKey: string
): Promise<ROFTCOData> {
  const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
      contents: [{ parts: [{ text: input }] }],
      generationConfig: {
        temperature: 0.7,
        responseMimeType: "application/json",
      },
    }),
  });

  if (!response.ok) {
    const errBody = await response.text();
    let message = `Gemini API error (${response.status})`;
    try {
      const parsed = JSON.parse(errBody);
      message = parsed?.error?.message || message;
    } catch { /* use default message */ }
    const error = new Error(message);
    (error as any).status = response.status;
    throw error;
  }

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error("Empty response from Gemini");

  const parsed = JSON.parse(text);
  return {
    role: parsed.role || "",
    objective: parsed.objective || "",
    features: parsed.features || "",
    techStack: parsed.techStack || "",
    constraint: parsed.constraint || "",
    outputFormat: parsed.outputFormat || "",
  };
}

const STORAGE_KEY = "jarvis-gemini-api-key";

const DEFAULT_KEY = "AIzaSyDZIzMoqi9ueQEswIdnhJXjsBixOzpLQcU";

export function getApiKey(): string {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) return stored;
  localStorage.setItem(STORAGE_KEY, DEFAULT_KEY);
  return DEFAULT_KEY;
}

export function setApiKey(key: string): void {
  localStorage.setItem(STORAGE_KEY, key);
}
