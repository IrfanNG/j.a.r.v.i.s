import { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { generateWithGroq } from "@/lib/groq";
import { ROFTCOData } from "@/lib/mock-roftco";
import HUDCard from "@/components/HUDCard";
import TypewriterText from "@/components/TypewriterText";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Terminal,
  Cpu,
  Sparkles,
  Copy,
  Check,
  Zap,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  Wand2,
  ChevronRight,
  Globe
} from "lucide-react";
import { toast } from "sonner";
import SEO from "@/components/SEO";

const ROFTCO_LABELS = [
  { key: "role", label: "Role" },
  { key: "objective", label: "Objective" },
  { key: "features", label: "Features" },
  { key: "techStack", label: "Tech Stack" },
  { key: "constraint", label: "Constraint" },
  { key: "outputFormat", label: "Output Format" },
] as const;

const emptyRoftco: ROFTCOData = {
  role: "",
  objective: "",
  features: "",
  techStack: "",
  constraint: "",
  outputFormat: "",
};

const WIZARD_STEPS = [
  {
    id: "idea",
    title: "The Core Idea",
    question: "What problem are you trying to solve? (The 'What')",
    placeholder: "e.g. A premium delivery platform for local artisans..."
  },
  {
    id: "audience",
    title: "Target Audience",
    question: "Who is the primary audience for this application? (The 'Who')",
    placeholder: "e.g. University students, remote professionals, or small business owners..."
  },
  {
    id: "vibe",
    title: "Design Vibe",
    question: "How should the application look and feel? (The 'Style')",
    placeholder: "e.g. Minimalist, cyberpunk dark mode, or clean Apple-like aesthetic..."
  },
  {
    id: "features",
    title: "Key Features",
    question: "Are there any specific 'must-have' features? (The 'Must-haves')",
    placeholder: "e.g. Biometric auth, real-time inventory, or multi-currency support..."
  }
];

const Index = () => {
  const [inputMode, setInputMode] = useState<"terminal" | "wizard">("terminal");
  const [input, setInput] = useState("");
  const [wizardStep, setWizardStep] = useState(0);
  const [wizardAnswers, setWizardAnswers] = useState<Record<string, string>>({});
  const [roftco, setRoftco] = useState<ROFTCOData>(emptyRoftco);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isRevealing, setIsRevealing] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [ghostIndex, setGhostIndex] = useState(0);

  const GHOST_TEXTS = useMemo(() => [
    "A premium boutique coffee marketplace...",
    "Smart warehouse management system...",
    "Automated university attendance portal...",
    "Hyper-local delivery tracking app...",
  ], []);

  // Ghost text rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setGhostIndex((i) => (i + 1) % GHOST_TEXTS.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [GHOST_TEXTS.length]);

  const handleGenerate = useCallback(async () => {
    const finalInput = inputMode === "terminal"
      ? input
      : `
        CORE IDEA: ${wizardAnswers.idea}
        TARGET AUDIENCE: ${wizardAnswers.audience}
        DESIGN VIBE: ${wizardAnswers.vibe}
        SPECIFIC FEATURES: ${wizardAnswers.features}
      `.trim();

    if (!finalInput.trim() || isProcessing) return;

    if (finalInput.trim().length < 10) {
      toast.warning("Input too short", {
        description: "Provide more detail for accurate parsing.",
      });
      return;
    }

    setIsProcessing(true);
    setRoftco(emptyRoftco);
    setIsRevealing(false);

    try {
      const result = await generateWithGroq(finalInput);
      setRoftco(result);
      setIsRevealing(true);
      toast.success("Protocol Generated", {
        description: "ROFTCO prompt successfully created.",
      });
    } catch (err: any) {
      const statusCode = err?.status;
      const msg = err?.message || "Unknown error";
      if (statusCode === 429) {
        toast.error("SYSTEM OVERHEAT", { description: "Rate limit exceeded. Retry in a moment." });
      } else {
        toast.error("SYSTEM ERROR", { description: msg });
      }
    } finally {
      setIsProcessing(false);
    }
  }, [input, inputMode, wizardAnswers, isProcessing]);

  const handleCopy = useCallback(() => {
    const hasContent = Object.values(roftco).some((v) => v.trim());
    if (!hasContent) return;

    const universalInstructions = `

## UNIVERSAL AGENTIC INSTRUCTIONS
- You are an elite AI Solution Architect.
- Execute deep architectural research before writing any code.
- Priority: High-fidelity, premium aesthetics with rich gradients and micro-animations.
- Structure: Modular, scalable directory structure with clean React hooks.
- UX: Proactively handle edge cases, security protocols (PDPA/CORS), and mobile Safe Areas (pt-safe/pb-safe).`;

    const prompt = ROFTCO_LABELS.map(
      ({ key, label }) => `## ${label}\n${roftco[key] || "N/A"}`
    ).join("\n\n") + universalInstructions;

    navigator.clipboard.writeText(prompt);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);

    toast.info("PROTOCOL DEPLOYED", {
      description: "ROFTCO prompt copied to clipboard.",
    });
  }, [roftco]);

  const hasOutput = Object.values(roftco).some((v) => v.trim());

  return (
    <div className="min-h-screen bg-background p-4 md:p-8 selection:bg-foreground selection:text-background flex flex-col items-center">
      <SEO />

      <header className="w-full max-w-6xl flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 border-b border-foreground/10 pb-6 pt-safe">
        <div className="flex items-center gap-3">
          <div className="bg-foreground p-2 rounded-sm shadow-glow-cyan">
            <Cpu className="w-6 h-6 text-background" />
          </div>
          <div>
            <h1 className="font-mono-hud text-2xl tracking-[0.4em] uppercase text-foreground">
              J.A.R.V.I.S.
            </h1>
            <p className="font-mono-hud text-[10px] text-foreground/40 tracking-widest mt-1">
              Neural Network Interface v4.2.0-STABLE
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-4 h-4 text-green-500" />
          <span className="font-mono-hud text-xs tracking-[0.2em] text-green-500 uppercase">
            System Online
          </span>
        </div>
      </header>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="relative z-10 w-full max-w-6xl"
      >
        <div className="mb-8 text-center md:text-left">
          <h2 className="font-mono-hud text-foreground/30 text-xs tracking-[0.15em] uppercase">
            Just A Reliable Vibe-coding Intelligent System
          </h2>
          <p className="font-body text-foreground/50 text-sm mt-1">
            Dump your messy ideas below. I'll structure them into a proper ROFTCO prompt.
          </p>
        </div>

        <div className="flex gap-2 mb-6 justify-center md:justify-start">
          <Button
            onClick={() => setInputMode("terminal")}
            disabled={isProcessing}
            className={`font-mono-hud text-[10px] tracking-[0.2em] px-4 py-1 h-auto transition-all ${
              inputMode === "terminal" ? "bg-foreground text-background" : "bg-background text-foreground/40 border border-border"
            }`}
          >
            <Terminal className="w-3 h-3 mr-2" /> Terminal Mode
          </Button>
          <Button
            onClick={() => setInputMode("wizard")}
            disabled={isProcessing}
            className={`font-mono-hud text-[10px] tracking-[0.2em] px-4 py-1 h-auto transition-all ${
              inputMode === "wizard" ? "bg-foreground text-background" : "bg-background text-foreground/40 border border-border"
            }`}
          >
            <Wand2 className="w-3 h-3 mr-2" /> Wizard Mode
          </Button>
        </div>

        <div className="mb-6">
          <AnimatePresence mode="wait">
            {inputMode === "terminal" ? (
              <motion.div
                key="terminal"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="relative"
              >
                <label htmlFor="terminal-input" className="font-mono-hud text-xs tracking-[0.2em] uppercase text-foreground/50 mb-2 block">
                  Brain Dump Terminal
                </label>
                <Textarea
                  id="terminal-input"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleGenerate();
                    }
                  }}
                  className="w-full min-h-[180px] bg-card border border-border text-foreground font-body text-sm p-4 resize-none
                    focus:outline-none focus:border-foreground focus:border-glow-cyan transition-all duration-300"
                  disabled={isProcessing}
                />
                {!input && (
                  <div className="absolute top-12 left-4 pointer-events-none font-mono-hud text-xs tracking-wider text-muted-foreground opacity-50">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={ghostIndex}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        transition={{ duration: 0.5 }}
                      >
                        <TypewriterText text={GHOST_TEXTS[ghostIndex]} />
                      </motion.div>
                    </AnimatePresence>
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="wizard"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-card border border-border p-6 relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 h-1 bg-foreground/10 w-full">
                  <motion.div
                    className="h-full bg-foreground"
                    initial={{ width: 0 }}
                    animate={{ width: `${((wizardStep + 1) / WIZARD_STEPS.length) * 100}%` }}
                  />
                </div>
                <div className="mb-4 flex items-center justify-between">
                  <span className="font-mono-hud text-[10px] tracking-[0.3em] text-foreground/30 uppercase">
                    Step {wizardStep + 1} of {WIZARD_STEPS.length}: {WIZARD_STEPS[wizardStep].title}
                  </span>
                </div>
                <h3 className="font-mono-hud text-sm tracking-wider text-foreground mb-4">
                  {WIZARD_STEPS[wizardStep].question}
                </h3>
                <Textarea
                  value={wizardAnswers[WIZARD_STEPS[wizardStep].id] || ""}
                  onChange={(e) => setWizardAnswers(prev => ({ ...prev, [WIZARD_STEPS[wizardStep].id]: e.target.value }))}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      if (wizardStep < WIZARD_STEPS.length - 1) {
                        if (wizardAnswers[WIZARD_STEPS[wizardStep].id]?.trim()) {
                          e.preventDefault();
                          setWizardStep(s => s + 1);
                        }
                      } else {
                        if (wizardAnswers[WIZARD_STEPS[wizardStep].id]?.trim()) {
                          e.preventDefault();
                          handleGenerate();
                        }
                      }
                    }
                  }}
                  placeholder={WIZARD_STEPS[wizardStep].placeholder}
                  className="w-full min-h-[120px] bg-background/50 border border-border/50 text-foreground font-body text-sm p-4 resize-none
                    focus:outline-none focus:border-foreground transition-all duration-300"
                  disabled={isProcessing}
                />
                <div className="mt-6 flex justify-between">
                  <Button
                    onClick={() => setWizardStep(s => Math.max(0, s - 1))}
                    disabled={wizardStep === 0 || isProcessing}
                    className="font-mono-hud text-[10px] tracking-[0.2em] bg-transparent text-foreground/40 hover:text-foreground border-none"
                  >
                    <ArrowLeft className="w-3 h-3 mr-2" /> Back
                  </Button>
                  {wizardStep < WIZARD_STEPS.length - 1 ? (
                    <Button
                      onClick={() => setWizardStep(s => s + 1)}
                      disabled={isProcessing || !(wizardAnswers[WIZARD_STEPS[wizardStep].id]?.trim())}
                      className="font-mono-hud text-[10px] tracking-[0.2em] bg-foreground text-background px-6"
                    >
                      Next Step <ArrowRight className="w-3 h-3 ml-2" />
                    </Button>
                  ) : (
                    <div className="w-20" />
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex items-center justify-center gap-4 mb-10">
          {isProcessing ? (
            <div className="flex items-center gap-4">
              <Sparkles className="w-6 h-6 text-foreground animate-pulse" />
              <span className="font-mono-hud text-xs tracking-[0.2em] text-foreground/60 uppercase">
                Processing...
              </span>
            </div>
          ) : (
            <Button
              onClick={handleGenerate}
              disabled={
                inputMode === "terminal"
                  ? !input.trim()
                  : wizardStep !== WIZARD_STEPS.length - 1 || !(wizardAnswers[WIZARD_STEPS[wizardStep].id]?.trim())
              }
              className={`bg-primary hover:bg-primary/90 text-primary-foreground font-mono-hud text-xs tracking-[0.2em] uppercase
                px-8 py-3 h-auto border border-primary/50 hover:border-glow-red transition-all duration-300
                disabled:opacity-30 disabled:cursor-not-allowed`}
            >
              <Zap className="w-4 h-4 mr-2" /> Initiate Protocol
            </Button>
          )}
        </div>

        <AnimatePresence>
          {hasOutput && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="font-mono-hud text-xs tracking-[0.3em] text-foreground/40 uppercase text-center mb-4">
                ROFTCO Output
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                {ROFTCO_LABELS.map(({ key, label }, index) => (
                  <HUDCard
                    key={key}
                    label={label}
                    content={roftco[key]}
                    index={index}
                    isRevealing={isRevealing}
                  />
                ))}
              </div>
              <div className="flex justify-center">
                <Button
                  onClick={handleCopy}
                  className="bg-background hover:bg-card text-foreground font-mono-hud text-xs tracking-[0.2em] uppercase
                    px-8 py-3 h-auto border border-foreground/40 hover:border-foreground hover:border-glow-cyan transition-all duration-300"
                >
                  {copySuccess ? <Check className="w-4 h-4 mr-2 text-green-400" /> : <Copy className="w-4 h-4 mr-2" />}
                  Deploy Protocol
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <section className="sr-only">
          <h2>About J.A.R.V.I.S. - AI Vibe-Coding Assistant</h2>
          <p>
            J.A.R.V.I.S. (Just A Reliable Vibe-coding Intelligent System) turns messy ideas into structured, technical prompts optimized for Lovable, v0, Cursor, and Bolt.
          </p>
          <ul>
            <li>Guided Wizard Mode</li>
            <li>Universal Agentic Instructions</li>
            <li>Technical Glossary</li>
          </ul>
        </section>

        <footer className="w-full mt-12 py-8 border-t border-foreground/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="font-mono-hud text-[10px] text-foreground/30 tracking-widest flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              SECURED CONNECTION
            </div>
            <div className="hidden md:block">|</div>
            <div className="flex items-center gap-2">
              <Globe className="w-3 h-3" />
              GLOBAL ACCESS
            </div>
          </div>
          <div className="font-mono-hud text-[10px] text-foreground/30 tracking-widest uppercase text-center md:text-right">
            © 2026 Stark Industries (Vibe Division)
          </div>
        </footer>
      </motion.div>
    </div>
  );
};

export default Index;
