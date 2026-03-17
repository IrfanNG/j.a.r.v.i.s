import { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { generateWithGroq } from "@/lib/groq";
import { ROFTCOData } from "@/lib/mock-roftco";
import HUDCard from "@/components/HUDCard";
import TypewriterText from "@/components/TypewriterText";
import { SystemStats } from "@/components/SystemStats";
import ScanLineOverlay from "@/components/ScanLineOverlay";
import ArcReactorSpinner from "@/components/ArcReactorSpinner";
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
    "Provide your messy ideas here...",
    "A premium boutique coffee marketplace...",
    "Smart warehouse management system...",
    "Automated university attendance portal...",
    "Hyper-local delivery tracking app...",
  ], []);

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
    } catch (err: unknown) {
      const error = err as { status?: number; message?: string };
      const statusCode = error?.status;
      const msg = error?.message || "Unknown error";

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

## UNIVERSAL AGENTIC INSTRUCTION
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
    <div className="min-h-screen bg-black text-cyan-50 font-body relative overflow-hidden selection:bg-cyan-500/30 selection:text-cyan-50">
      <SEO />
      <ScanLineOverlay />

      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-900/20 via-black to-black pointer-events-none" />

      <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col items-center p-4 md:p-8">
        <header className="w-full flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 border-b border-cyan-500/30 pb-6 pt-safe">
          <div className="flex items-center gap-3">
            <div className="bg-cyan-500/10 p-2 rounded-sm border border-cyan-500/30 shadow-[0_0_15px_rgba(34,211,238,0.2)]">
              <Cpu className="w-6 h-6 text-cyan-400" />
            </div>
            <div>
              <h1 className="font-mono-hud text-2xl tracking-[0.4em] uppercase text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]">
                J.A.R.V.I.S.
              </h1>
              <p className="font-mono-hud text-[10px] text-cyan-500/50 tracking-widest mt-1">
                J.A.R.V.I.S. 2.0 STRUCTURAL HUD
              </p>
            </div>
          </div>
          <SystemStats />
        </header>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="w-full"
        >
          <div className="mb-8 text-center md:text-left">
            <h2 className="font-mono-hud text-cyan-500/50 text-xs tracking-[0.15em] uppercase">
              Just A Reliable Vibe-coding Intelligent System
            </h2>
          </div>

          <div className="flex justify-center md:justify-start gap-2 mb-6">
            <Button
              onClick={() => setInputMode("terminal")}
              disabled={isProcessing}
              className={`font-mono-hud text-[10px] tracking-[0.2em] px-4 py-1 h-auto transition-all backdrop-blur-sm ${
                inputMode === "terminal" ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500 shadow-[0_0_10px_rgba(34,211,238,0.3)]" : "bg-black/40 text-cyan-500/40 border border-cyan-900/50 hover:border-cyan-500/50"
              }`}
            >
              <Terminal className="w-3 h-3 mr-2" /> Terminal Mode
            </Button>
            <Button
              onClick={() => setInputMode("wizard")}
              disabled={isProcessing}
              className={`font-mono-hud text-[10px] tracking-[0.2em] px-4 py-1 h-auto transition-all backdrop-blur-sm ${
                inputMode === "wizard" ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500 shadow-[0_0_10px_rgba(34,211,238,0.3)]" : "bg-black/40 text-cyan-500/40 border border-cyan-900/50 hover:border-cyan-500/50"
              }`}
            >
              <Wand2 className="w-3 h-3 mr-2" /> Wizard Mode
            </Button>
          </div>

          <div className="mb-10">
            <AnimatePresence mode="wait">
              {inputMode === "terminal" ? (
                <motion.div
                  key="terminal"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="relative"
                >
                  <label htmlFor="terminal-input" className="font-mono-hud text-xs tracking-[0.2em] uppercase text-cyan-500/70 mb-2 block flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
                    Input Terminal
                  </label>
                  <div className="relative">
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
                      className="w-full min-h-[180px] bg-black/60 border border-cyan-800/50 text-cyan-100 font-body text-sm p-4 resize-none backdrop-blur-md
                        focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_20px_rgba(34,211,238,0.2)] focus:ring-1 focus:ring-cyan-400/50 transition-all duration-300"
                      disabled={isProcessing}
                    />
                    {!input && (
                      <div className="absolute top-4 left-4 pointer-events-none font-mono-hud text-xs tracking-wider text-cyan-500/40">
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
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="wizard"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-black/60 border border-cyan-800/50 p-6 relative overflow-hidden backdrop-blur-md"
                >
                  <div className="absolute top-0 left-0 h-1 bg-cyan-900/30 w-full">
                    <motion.div
                      className="h-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.8)]"
                      initial={{ width: 0 }}
                      animate={{ width: `${((wizardStep + 1) / WIZARD_STEPS.length) * 100}%` }}
                    />
                  </div>
                  <div className="mb-4 flex items-center justify-between">
                    <span className="font-mono-hud text-[10px] tracking-[0.3em] text-cyan-500/60 uppercase">
                      Step {wizardStep + 1} of {WIZARD_STEPS.length}: {WIZARD_STEPS[wizardStep].title}
                    </span>
                  </div>
                  <h3 className="font-mono-hud text-sm tracking-wider text-cyan-300 mb-4 drop-shadow-[0_0_5px_rgba(34,211,238,0.5)]">
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
                    className="w-full min-h-[120px] bg-black/40 border border-cyan-900/50 text-cyan-100 font-body text-sm p-4 resize-none
                      focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_15px_rgba(34,211,238,0.2)] transition-all duration-300"
                    disabled={isProcessing}
                  />
                  <div className="mt-6 flex justify-between">
                    <Button
                      onClick={() => setWizardStep(s => Math.max(0, s - 1))}
                      disabled={wizardStep === 0 || isProcessing}
                      className="font-mono-hud text-[10px] tracking-[0.2em] bg-transparent text-cyan-600 hover:text-cyan-400 border-none px-0"
                    >
                      <ArrowLeft className="w-3 h-3 mr-2" /> Back
                    </Button>
                    {wizardStep < WIZARD_STEPS.length - 1 ? (
                      <Button
                        onClick={() => setWizardStep(s => s + 1)}
                        disabled={isProcessing || !(wizardAnswers[WIZARD_STEPS[wizardStep].id]?.trim())}
                        className="font-mono-hud text-[10px] tracking-[0.2em] bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 hover:bg-cyan-500/30 hover:border-cyan-400 px-6 transition-all shadow-[0_0_10px_rgba(34,211,238,0.1)] hover:shadow-[0_0_15px_rgba(34,211,238,0.3)] disabled:opacity-50"
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

          <div className="flex items-center justify-center gap-4 mb-10 min-h-[60px]">
            {isProcessing ? (
              <div className="flex items-center gap-6">
                <ArcReactorSpinner size={60} />
                <span className="font-mono-hud text-sm tracking-[0.3em] text-cyan-400 uppercase drop-shadow-[0_0_5px_rgba(34,211,238,0.8)] animate-pulse">
                  Analyzing Data...
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
                className="bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 hover:text-cyan-100 font-mono-hud text-xs tracking-[0.2em] uppercase px-8 py-4 h-auto border border-cyan-500/60 hover:border-cyan-300 hover:shadow-[0_0_20px_rgba(34,211,238,0.4)] transition-all duration-300 disabled:opacity-30 disabled:hover:border-cyan-500/60 disabled:hover:shadow-none disabled:cursor-not-allowed"
              >
                <Zap className="w-4 h-4 mr-2" /> Initiate Protocol
              </Button>
            )}
          </div>

          <AnimatePresence>
            {hasOutput && !isProcessing && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="w-full"
              >
                <div className="flex items-center justify-center mb-8">
                  <div className="h-[1px] w-16 bg-gradient-to-r from-transparent to-cyan-500/50" />
                  <h2 className="font-mono-hud text-xs tracking-[0.4em] text-cyan-400 uppercase text-center mx-4 drop-shadow-[0_0_5px_rgba(34,211,238,0.8)]">
                    ROFTCO Output
                  </h2>
                  <div className="h-[1px] w-16 bg-gradient-to-l from-transparent to-cyan-500/50" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
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
                    className="bg-black/40 hover:bg-cyan-900/30 text-cyan-300 hover:text-cyan-100 font-mono-hud text-xs tracking-[0.2em] uppercase px-8 py-4 h-auto border border-cyan-800 hover:border-cyan-400 hover:shadow-[0_0_15px_rgba(34,211,238,0.3)] transition-all duration-300 group overflow-hidden relative"
                  >
                    <div className="absolute inset-0 bg-cyan-500/10 w-0 group-hover:w-full transition-all duration-300 ease-out" />
                    <div className="relative flex items-center z-10">
                      <AnimatePresence mode="wait">
                        {copySuccess ? (
                          <motion.div
                            key="check"
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            exit={{ scale: 0, rotate: 180 }}
                            transition={{ type: "spring", stiffness: 200, damping: 10 }}
                          >
                            <Check className="w-5 h-5 mr-3 text-[#FFD700] drop-shadow-[0_0_12px_rgba(255,215,0,0.9)]" />
                          </motion.div>
                        ) : (
                          <motion.div
                            key="copy"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                          >
                            <Copy className="w-4 h-4 mr-3 text-cyan-400" />
                          </motion.div>
                        )}
                      </AnimatePresence>
                      <span className={copySuccess ? "text-[#FFD700]" : ""}>
                        {copySuccess ? "PROTOCOL DEPLOYED" : "Deploy Protocol"}
                      </span>
                    </div>
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <footer className="w-full mt-16 py-8 border-t border-cyan-500/20 flex flex-col md:flex-row justify-between items-center gap-4 relative z-10">
            <div className="font-mono-hud text-[10px] text-cyan-500/50 tracking-widest flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
                SECURED CONNECTION
              </div>
              <div className="hidden md:block text-cyan-900 border-l border-cyan-800 h-4" />
              <div className="flex items-center gap-2">
                <Globe className="w-3 h-3 text-cyan-600" />
                GLOBAL ACCESS
              </div>
            </div>
            <div className="font-mono-hud text-[10px] text-cyan-500/40 tracking-widest uppercase text-center md:text-right">
              © 2026 Stark Industries (Vibe Division)
            </div>
          </footer>
        </motion.div>
      </div>
    </div>
  );
};

export default Index;
