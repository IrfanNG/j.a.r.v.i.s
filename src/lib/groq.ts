import type { ROFTCOData } from "./mock-roftco";

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

const SYSTEM_PROMPT = `You are J.A.R.V.I.S. Convert the user's messy idea (in Malay or English) into a 6-part ROFTCO prompt (Role, Objective, Features, Tech Stack, Constraint, Output Format). Output strictly in raw JSON format matching these keys: role, objective, features, techStack, constraint, outputFormat. Do not include markdown like \`\`\`json. Be specific and actionable. Features should be bullet points prefixed with "•". Keep the Tech Stack strictly modern unless the user explicitly specifies otherwise. If no tech stack is mentioned, default to: Next.js, Supabase, Tailwind CSS, TypeScript.`;

export async function generateWithGroq(
  input: string,
  apiKey: string
): Promise<ROFTCOData> {
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
    if (typeof val === "string") return val;
    if (Array.isArray(val)) return val.map((v) => `• ${v}`).join("\n");
    if (val && typeof val === "object") return JSON.stringify(val);
    return String(val ?? "");
  };

  return {
    role: str(parsed.role),
    objective: str(parsed.objective),
    features: str(parsed.features),
    techStack: str(parsed.techStack),
    constraint: str(parsed.constraint),
    outputFormat: str(parsed.outputFormat),
  };
}

const STORAGE_KEY = "jarvis-groq-api-key";
const DEFAULT_KEY = "REDACTED_API_KEY";

export function getApiKey(): string {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, DEFAULT_KEY);
    return DEFAULT_KEY;
  }
  return stored;
}

export function setApiKey(key: string): void {
  localStorage.setItem(STORAGE_KEY, key);
}
