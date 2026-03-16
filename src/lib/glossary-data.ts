export interface GlossaryTerm {
  term: string;
  definition: string;
  category: "frontend" | "backend" | "database" | "api" | "general";
}

export const GLOSSARY_DATA: GlossaryTerm[] = [
  {
    term: "Next.js",
    definition: "A high-performance React framework optimized for SEO and modern web applications.",
    category: "frontend"
  },
  {
    term: "React Native",
    definition: "Build native mobile apps (Android & iOS) simultaneously using JavaScript and React.",
    category: "frontend"
  },
  {
    term: "Tailwind CSS",
    definition: "A utility-first CSS framework for rapid UI development without leaving your HTML.",
    category: "frontend"
  },
  {
    term: "Supabase",
    definition: "An open-source Firebase alternative providing a real-time database and Auth out of the box.",
    category: "backend"
  },
  {
    term: "REST API",
    definition: "A standardized architectural style for networked applications to communicate via HTTP.",
    category: "api"
  },
  {
    term: "MongoDB",
    definition: "A flexible NoSQL database designed for scalability and handling complex data structures.",
    category: "database"
  },
  {
    term: "PostgreSQL",
    definition: "The industry-standard relational database, known for reliability and robust data integrity.",
    category: "database"
  },
  {
    term: "Node.js",
    definition: "A JavaScript runtime built on Chrome's V8 engine for building scalable server-side applications.",
    category: "backend"
  },
  {
    term: "FastAPI",
    definition: "A modern, high-performance web framework for building APIs with Python.",
    category: "api"
  },
  {
    term: "Shadcn UI",
    definition: "Beautifully designed, accessible components that you can copy and paste into your apps.",
    category: "frontend"
  },
  {
    term: "Auth",
    definition: "Short for Authentication; the process of verifying a user's identity and managing sessions.",
    category: "general"
  },
  {
    term: "SEO",
    definition: "Search Engine Optimization – techniques to improve visibility on search engines like Google.",
    category: "general"
  },
  {
    term: "Real-time",
    definition: "Instantaneous data updates often achieved via WebSockets (e.g., live chat or live feeds).",
    category: "general"
  },
  {
    term: "Dashboard",
    definition: "An administrative interface for monitoring data and managing system operations.",
    category: "frontend"
  },
  {
    term: "Flutter",
    definition: "Google's UI toolkit for building natively compiled applications for mobile, web, and desktop.",
    category: "frontend"
  },
  {
    term: "Stripe",
    definition: "A secure and developer-friendly online payment processing system.",
    category: "api"
  },
  {
    term: "Firebase",
    definition: "Google's platform for rapid mobile and web application development.",
    category: "backend"
  },
  {
    term: "Astro",
    definition: "A modern web framework focusing on content-driven websites with minimal client-side JS.",
    category: "frontend"
  },
  {
    term: "Unity",
    definition: "The world's leading real-time 3D development platform for games and interactive experiences.",
    category: "general"
  },
  {
    term: "Redis",
    definition: "An ultra-fast, in-memory data store frequently used as a database, cache, and message broker.",
    category: "database"
  },
  {
    term: "Docker",
    definition: "A platform for containerizing applications to ensure consistency across different environments.",
    category: "general"
  },
  {
    term: "TypeScript",
    definition: "A strict syntactical superset of JavaScript that adds static typing for better developer productivity.",
    category: "general"
  }
];
