import { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Zap, Terminal } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import HUDCard from "@/components/HUDCard";
import ArcReactorSpinner from "@/components/ArcReactorSpinner";
import ScanLineOverlay from "@/components/ScanLineOverlay";
import StatusIndicator, { type SystemStatus } from "@/components/StatusIndicator";
import { Button } from "@/components/ui/button";

import { generateWithGroq } from "@/lib/groq";

interface ROFTCOData {
  role: string;
  objective: string;
  features: string;
  techStack: string;
  constraint: string;
  outputFormat: string;
}

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
    question: "Apa masalah yang ipan nak selesaikan? (The 'What')",
    placeholder: "e.g. App jual nasi lemak level kayangan..."
  },
  {
    id: "audience",
    title: "Target Audience",
    question: "Siapa yang akan guna app ni? (The 'Who')",
    placeholder: "e.g. Student UniKL, orang ofis, atau makcik kantin..."
  },
  {
    id: "vibe",
    title: "Design Vibe",
    question: "Vibe app ni nak macam mana? (The 'Style')",
    placeholder: "e.g. Minimalist, dark mode cyberpunk, atau bento-box clean..."
  },
  {
    id: "features",
    title: "Key Features",
    question: "Ada feature spesifik yang wajib ada? (The 'Must-haves')",
    placeholder: "e.g. Login guna IC, payment gateway, atau map real-time..."
  }
];

const Index = () => {
  const [status, setStatus] = useState<SystemStatus>("booting");
  const [inputMode, setInputMode] = useState<"terminal" | "wizard">("terminal");
  const [input, setInput] = useState("");
  const [wizardStep, setWizardStep] = useState(0);
  const [wizardAnswers, setWizardAnswers] = useState<Record<string, string>>({});
  const [roftco, setRoftco] = useState<ROFTCOData>(emptyRoftco);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isRevealing, setIsRevealing] = useState(false);
  const [booted, setBooted] = useState(false);
  const [showFlash, setShowFlash] = useState(false);
  const [ghostIndex, setGhostIndex] = useState(0);

  const GHOST_TEXTS = useMemo(() => [
    "App jual nasi lemak...",
    "UniKL student house hunting app...",
    "Travel planner for Cuti-Cuti Malaysia...",
    "Borang kehadiran pelajar...",
  ], []);

  // Boot sequence
  useEffect(() => {
    const timer = setTimeout(() => {
      setStatus("ready");
      setBooted(true);
      toast({
        title: "J.A.R.V.I.S. ONLINE",
        description: "Neural engine connected. System ready for input.",
      });
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  // Ghost text rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setGhostIndex((i) => (i + 1) % GHOST_TEXTS.length);
    }, 3000);
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
      setStatus("warning");
      toast({
        title: "SYSTEM WARNING",
        description: "Input too short. Provide more detail for accurate parsing.",
      });
      setTimeout(() => setStatus("ready"), 2000);
      return;
    }

    setIsProcessing(true);
    setStatus("processing");
    setRoftco(emptyRoftco);
    setIsRevealing(false);

    try {
      console.log("J.A.R.V.I.S. Engine: Connecting to Groq...");
      const result = await generateWithGroq(finalInput);
      console.log("J.A.R.V.I.S. Engine: Response received successfully");
      setRoftco(result);
      setIsRevealing(true);
      setStatus("complete");
    } catch (err: any) {
      console.error("J.A.R.V.I.S. Engine: Connection failed —", err.message);
      setStatus("error");

      const statusCode = err?.status;
      const msg = err?.message || "Unknown error";

      if (statusCode === 429) {
        toast({ title: "SYSTEM OVERHEAT", description: "Rate limit exceeded. Retry in a moment.", variant: "destructive" });
      } else if (statusCode === 400 || statusCode === 401 || statusCode === 403) {
        toast({ title: "ACCESS DENIED", description: msg, variant: "destructive" });
      } else {
        toast({ title: "SYSTEM ERROR", description: msg, variant: "destructive" });
      }
    } finally {
      setIsProcessing(false);
    }
  }, [input, inputMode, wizardAnswers, isProcessing]);


  const handleCopy = useCallback(() => {
    const hasContent = Object.values(roftco).some((v) => v.trim());
    if (!hasContent) return;

    const prompt = ROFTCO_LABELS.map(
      ({ key, label }) => `## ${label}\n${roftco[key] || "N/A"}`
    ).join("\n\n");

    navigator.clipboard.writeText(prompt);
    setShowFlash(true);
    setTimeout(() => setShowFlash(false), 400);

    toast({
      title: "PROTOCOL DEPLOYED",
      description: "ROFTCO prompt copied to clipboard.",
    });
  }, [roftco]);

  const hasOutput = Object.values(roftco).some((v) => v.trim());

  return (
    <div className="relative min-h-screen bg-background overflow-hidden">
      <ScanLineOverlay />

      {/* Cyan flash overlay */}
      <AnimatePresence>
        {showFlash && (
          <motion.div
            initial={{ opacity: 0.5 }}
            animate={{ opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-40 bg-foreground/10 pointer-events-none"
          />
        )}
      </AnimatePresence>

      {/* Boot sequence overlay */}
      <AnimatePresence>
        {!booted && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="fixed inset-0 z-50 bg-background flex items-center justify-center"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0.3, 1] }}
              transition={{ duration: 1.5 }}
              className="text-center"
            >
              <div className="font-mono-hud text-foreground text-lg tracking-[0.4em] mb-4">
                J.A.R.V.I.S.
              </div>
              <div className="font-mono-hud text-foreground/40 text-xs tracking-[0.2em]">
                INITIALIZING SYSTEMS...
              </div>
              <motion.div
                className="mt-6 h-px bg-foreground/30 mx-auto"
                initial={{ width: 0 }}
                animate={{ width: 200 }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: booted ? 1 : 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-8"
      >
        {/* Header */}
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Terminal className="w-5 h-5 text-foreground" />
            <h1 className="font-mono-hud text-foreground text-sm tracking-[0.3em] uppercase">
              J.A.R.V.I.S.
            </h1>
          </div>
          <StatusIndicator status={status} />
        </header>

        {/* Subtitle */}
        <div className="mb-8">
          <p className="font-mono-hud text-foreground/30 text-xs tracking-[0.15em] uppercase">
            Just A Reliable Vibe-coding Intelligent System
          </p>
          <p className="font-body text-foreground/50 text-sm mt-1">
            Dump your messy ideas below. I'll structure them into a proper ROFTCO prompt.
          </p>
        </div>

        {/* Mode Toggle */}
        <div className="flex gap-2 mb-6">
          <Button
            onClick={() => setInputMode("terminal")}
            disabled={isProcessing}
            className={`font-mono-hud text-[10px] tracking-[0.2em] px-4 py-1 h-auto transition-all ${
              inputMode === "terminal" 
                ? "bg-foreground text-background" 
                : "bg-background text-foreground/40 border border-border"
            }`}
          >
            Terminal Mode
          </Button>
          <Button
            onClick={() => setInputMode("wizard")}
            disabled={isProcessing}
            className={`font-mono-hud text-[10px] tracking-[0.2em] px-4 py-1 h-auto transition-all ${
              inputMode === "wizard" 
                ? "bg-foreground text-background" 
                : "bg-background text-foreground/40 border border-border"
            }`}
          >
            Wizard Mode
          </Button>
        </div>

        {/* Dynamic Input Section */}
        <div className="mb-6">
          <AnimatePresence mode="wait">
            {inputMode === "terminal" ? (
              <motion.div
                key="terminal"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <label className="font-mono-hud text-xs tracking-[0.2em] uppercase text-foreground/50 mb-2 block">
                  Brain Dump Terminal
                </label>
                <div className="relative">
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleGenerate();
                      }
                    }}
                    placeholder=""
                    className="w-full min-h-[180px] bg-card border border-border text-foreground font-body text-sm p-4 resize-none
                      placeholder:text-muted-foreground placeholder:font-mono-hud placeholder:text-xs placeholder:tracking-wider
                      focus:outline-none focus:border-foreground focus:border-glow-cyan transition-all duration-300"
                    disabled={isProcessing}
                  />
                  {!input && (
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={ghostIndex}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.4 }}
                        className="absolute top-4 left-4 pointer-events-none font-mono-hud text-xs tracking-wider text-muted-foreground"
                      >
                        {GHOST_TEXTS[ghostIndex]}
                      </motion.div>
                    </AnimatePresence>
                  )}
                  {/* Corner accents */}
                  <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-foreground/50 pointer-events-none" />
                  <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-foreground/50 pointer-events-none" />
                  <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-foreground/50 pointer-events-none" />
                  <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-foreground/50 pointer-events-none" />
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="wizard"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-card border border-border p-6 relative overflow-hidden"
              >
                {/* Progress bar */}
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

                <textarea
                  value={wizardAnswers[WIZARD_STEPS[wizardStep].id] || ""}
                  onChange={(e) => setWizardAnswers(prev => ({ ...prev, [WIZARD_STEPS[wizardStep].id]: e.target.value }))}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
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
                    Back
                  </Button>
                  
                  {wizardStep < WIZARD_STEPS.length - 1 ? (
                    <Button
                      onClick={() => setWizardStep(s => s + 1)}
                      disabled={isProcessing || !(wizardAnswers[WIZARD_STEPS[wizardStep].id]?.trim())}
                      className="font-mono-hud text-[10px] tracking-[0.2em] bg-foreground text-background px-6"
                    >
                      Next Step
                    </Button>
                  ) : (
                    <div className="w-20" /> /* Placeholder to keep layout */
                  )}
                </div>
                
                {/* Corner accents */}
                <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-foreground/50 pointer-events-none" />
                <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-foreground/50 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-foreground/50 pointer-events-none" />
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-foreground/50 pointer-events-none" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Generate button */}
        <div className="flex items-center justify-center gap-4 mb-10">
          {isProcessing ? (
            <div className="flex items-center gap-4">
              <ArcReactorSpinner size={48} />
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
                disabled:opacity-30 disabled:cursor-not-allowed ${
                  (inputMode === "terminal" ? input.trim() : (wizardStep === WIZARD_STEPS.length - 1 && wizardAnswers[WIZARD_STEPS[wizardStep].id]?.trim())) 
                  ? "animate-pulse-glow" : ""
                }`}
            >
              <Zap className="w-4 h-4 mr-2" />
              Initiate Protocol
            </Button>
          )}
        </div>

        {/* ROFTCO Output Grid */}
        <AnimatePresence>
          {hasOutput && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="h-px flex-1 bg-border" />
                <span className="font-mono-hud text-xs tracking-[0.3em] text-foreground/40 uppercase">
                  ROFTCO Output
                </span>
                <div className="h-px flex-1 bg-border" />
              </div>

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

              {/* Deploy Protocol Button */}
              <div className="flex justify-center">
                <Button
                  onClick={handleCopy}
                  className="bg-background hover:bg-card text-foreground font-mono-hud text-xs tracking-[0.2em] uppercase
                    px-8 py-3 h-auto border border-foreground/40 hover:border-foreground hover:border-glow-cyan transition-all duration-300"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Deploy Protocol
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <footer className="mt-16 border-t border-border/30 pt-4 flex items-center justify-between">
          <span className="font-mono-hud text-[10px] tracking-[0.2em] text-foreground/20 uppercase">
            Stark Industries × KD x UniKL Builders
          </span>
          <span className="font-mono-hud text-[10px] tracking-[0.2em] text-foreground/20 uppercase">
            v1.0.0-alpha
          </span>
        </footer>
      </motion.div>
    </div>
  );
};

export default Index;
