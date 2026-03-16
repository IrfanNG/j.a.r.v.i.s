export interface GlossaryTerm {
  term: string;
  definition: string;
  category: "frontend" | "backend" | "database" | "api" | "general";
}

export const GLOSSARY_DATA: GlossaryTerm[] = [
  {
    term: "Next.js",
    definition: "Framework React yang sangat laju, sesuai untuk SEO dan web app modern.",
    category: "frontend"
  },
  {
    term: "React Native",
    definition: "Guna JavaScript untuk bina app telefon (Android & iOS) serentak.",
    category: "frontend"
  },
  {
    term: "Tailwind CSS",
    definition: "Cara styling web paling cepat guna class-class sedia ada (Utility-first).",
    category: "frontend"
  },
  {
    term: "Supabase",
    definition: "Database open-source yang sangat senang, siap dengan sistem login (Auth).",
    category: "backend"
  },
  {
    term: "REST API",
    definition: "Cara sistem berhubung antara satu sama lain guna cara standard (HTTP).",
    category: "api"
  },
  {
    term: "MongoDB",
    definition: "Database jenis NoSQL yang fleksibel, sesuai untuk simpan data complex.",
    category: "database"
  },
  {
    term: "PostgreSQL",
    definition: "Database standard industri yang sangat power untuk data yang tersusun.",
    category: "database"
  },
  {
    term: "Node.js",
    definition: "Guna JavaScript untuk buat server (backend).",
    category: "backend"
  },
  {
    term: "FastAPI",
    definition: "Framework Python yang sangat laju untuk bina API.",
    category: "api"
  },
  {
    term: "Shadcn UI",
    definition: "Koleksi component cantik yang boleh copy-paste masuk project.",
    category: "frontend"
  },
  {
    term: "Auth",
    definition: "Singkatan Authentication, sistem untuk login dan identiti user.",
    category: "general"
  },
  {
    term: "SEO",
    definition: "Search Engine Optimization - supaya web senang jumpa kat Google.",
    category: "general"
  },
  {
    term: "Real-time",
    definition: "Data update sekelip mata (macam chat WhatsApp).",
    category: "general"
  },
  {
    term: "Dashboard",
    definition: "Muka depan app untuk monitor data secara visual.",
    category: "frontend"
  },
  {
    term: "Flutter",
    definition: "Framework dari Google untuk bina app cantik untuk semua skrin.",
    category: "frontend"
  },
  {
    term: "Stripe",
    definition: "Sistem payment online yang paling popular dan secure.",
    category: "api"
  },
  {
    term: "Firebase",
    definition: "Platform dari Google untuk permudahkan buat app mobile/web.",
    category: "backend"
  },
  {
    term: "Astro",
    definition: "Framework web yang sangat ringan dan laju, fokus pada content.",
    category: "frontend"
  },
  {
    term: "Unity",
    definition: "Engine game paling popular untuk buat game 2D dan 3D.",
    category: "general"
  },
  {
    term: "Redis",
    definition: "Penyimpanan data super-laju dalam memori, selalunya untuk caching.",
    category: "database"
  },
  {
    term: "Docker",
    definition: "Teknologi untuk 'bungkus' app supaya boleh run kat mana-mana server dengan stabil.",
    category: "general"
  },
  {
    term: "TypeScript",
    definition: "Versi JavaScript yang lebih 'strict' dan selamat untuk elak bug.",
    category: "general"
  }
];
