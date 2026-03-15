export interface ROFTCOData {
  role: string;
  objective: string;
  features: string;
  techStack: string;
  constraint: string;
  outputFormat: string;
}

const keywords = {
  web: ["website", "web", "landing", "page", "site", "blog", "portfolio"],
  mobile: ["mobile", "app", "ios", "android", "react native"],
  api: ["api", "backend", "server", "endpoint", "rest", "graphql"],
  ai: ["ai", "machine learning", "ml", "chatbot", "gpt", "llm"],
  ecommerce: ["shop", "store", "ecommerce", "e-commerce", "cart", "payment"],
  dashboard: ["dashboard", "admin", "analytics", "panel", "monitoring"],
};

function detectCategory(input: string): string {
  const lower = input.toLowerCase();
  for (const [category, words] of Object.entries(keywords)) {
    if (words.some((w) => lower.includes(w))) return category;
  }
  return "general";
}

function extractTechHints(input: string): string[] {
  const techs: string[] = [];
  const lower = input.toLowerCase();
  const techMap: Record<string, string> = {
    react: "React", vue: "Vue.js", angular: "Angular", next: "Next.js",
    tailwind: "Tailwind CSS", typescript: "TypeScript", node: "Node.js",
    python: "Python", firebase: "Firebase", supabase: "Supabase",
    postgres: "PostgreSQL", mongo: "MongoDB", stripe: "Stripe",
  };
  for (const [key, label] of Object.entries(techMap)) {
    if (lower.includes(key)) techs.push(label);
  }
  return techs;
}

const templates: Record<string, Partial<ROFTCOData>> = {
  web: {
    role: "Act as a Senior Frontend Engineer and UI/UX Designer with expertise in modern web development.",
    techStack: "React, Vite, Tailwind CSS, TypeScript, Framer Motion",
    constraint: "Ensure responsive design across all breakpoints. Follow accessibility best practices (WCAG 2.1 AA). Keep bundle size under 200KB gzipped.",
    outputFormat: "A fully functional, production-ready web application with clean component architecture, proper error handling, and comprehensive documentation.",
  },
  mobile: {
    role: "Act as a Senior Mobile Developer specializing in cross-platform mobile applications.",
    techStack: "React Native, Expo, TypeScript, React Navigation",
    constraint: "Support iOS 14+ and Android 10+. Optimize for performance with lazy loading and memoization. Follow platform-specific design guidelines.",
    outputFormat: "A cross-platform mobile application with native-feeling interactions, offline support, and app store-ready builds.",
  },
  api: {
    role: "Act as a Senior Backend Engineer with expertise in RESTful API design and microservices architecture.",
    techStack: "Node.js, Express/Fastify, PostgreSQL, Redis, Docker",
    constraint: "Follow REST conventions strictly. Implement rate limiting, input validation, and proper error codes. All endpoints must be documented with OpenAPI 3.0.",
    outputFormat: "A production-ready API server with comprehensive endpoint documentation, database migrations, and deployment configuration.",
  },
  ai: {
    role: "Act as an AI/ML Engineer with expertise in large language models and intelligent system design.",
    techStack: "Python, LangChain, OpenAI API, FastAPI, Vector Database",
    constraint: "Implement proper prompt engineering. Handle token limits and rate limiting gracefully. Include fallback mechanisms for API failures.",
    outputFormat: "An AI-powered application with structured prompt pipelines, response parsing, and a clean user interface for interaction.",
  },
  ecommerce: {
    role: "Act as a Full-Stack E-commerce Developer with expertise in payment systems and inventory management.",
    techStack: "React, Node.js, Stripe, PostgreSQL, Redis",
    constraint: "PCI DSS compliant payment handling. Implement cart persistence, inventory locking, and order state machines. Support multiple currencies.",
    outputFormat: "A complete e-commerce platform with product catalog, cart system, checkout flow, and order management dashboard.",
  },
  dashboard: {
    role: "Act as a Data Visualization Engineer specializing in real-time analytics dashboards.",
    techStack: "React, D3.js/Recharts, WebSocket, TypeScript, Tailwind CSS",
    constraint: "Handle real-time data streams efficiently. Support data export in CSV/PDF. Implement role-based access control for different dashboard views.",
    outputFormat: "An interactive analytics dashboard with filterable charts, real-time updates, and exportable reports.",
  },
  general: {
    role: "Act as a Senior Software Engineer with broad full-stack expertise and strong architecture skills.",
    techStack: "React, TypeScript, Tailwind CSS, Node.js",
    constraint: "Write clean, maintainable code following SOLID principles. Include error handling, loading states, and edge case management.",
    outputFormat: "A well-architected application with modular components, clear documentation, and production-ready code quality.",
  },
};

export function generateMockROFTCO(input: string): Promise<ROFTCOData> {
  return new Promise((resolve) => {
    const delay = 1200 + Math.random() * 800;
    setTimeout(() => {
      const category = detectCategory(input);
      const template = templates[category] || templates.general;
      const detectedTechs = extractTechHints(input);

      const firstSentence = input.split(/[.!?\n]/)[0]?.trim() || input.trim();
      const objective = `Build ${firstSentence.charAt(0).toLowerCase()}${firstSentence.slice(1)}${firstSentence.endsWith(".") ? "" : "."}`;

      const features = input.length > 30
        ? input
            .split(/[.!?\n,;]/)
            .map((s) => s.trim())
            .filter((s) => s.length > 5)
            .map((s) => `• ${s.charAt(0).toUpperCase()}${s.slice(1)}`)
            .join("\n") || "• Core functionality as described\n• Clean, intuitive user interface\n• Error handling and loading states"
        : "• Core functionality as described\n• Clean, intuitive user interface\n• Responsive design\n• Error handling and loading states";

      resolve({
        role: template.role || templates.general.role!,
        objective,
        features,
        techStack: detectedTechs.length > 0
          ? detectedTechs.join(", ")
          : template.techStack || templates.general.techStack!,
        constraint: template.constraint || templates.general.constraint!,
        outputFormat: template.outputFormat || templates.general.outputFormat!,
      });
    }, delay);
  });
}
