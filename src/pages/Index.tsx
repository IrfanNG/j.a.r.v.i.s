import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Zap, Terminal } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import HUDCard from "@/components/HUDCard";
import ArcReactorSpinner from "@/components/ArcReactorSpinner";
import ScanLineOverlay from "@/components/ScanLineOverlay";
import StatusIndicator, { type SystemStatus } from "@/components/StatusIndicator";
import { Button } from "@/components/ui/button";
import { generateMockROFTCO } from "@/lib/mock-roftco";

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

const Index = () => {
  const [status, setStatus] = useState<SystemStatus>("booting");
  const [input, setInput] = useState("");
  const [roftco, setRoftco] = useState<ROFTCOData>(emptyRoftco);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isRevealing, setIsRevealing] = useState(false);
  const [booted, setBooted] = useState(false);
  const [showFlash, setShowFlash] = useState(false);

  // Boot sequence
  useEffect(() => {
    const timer = setTimeout(() => {
      setStatus("ready");
      setBooted(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleGenerate = useCallback(async () => {
    if (!input.trim() || isProcessing) return;

    setIsProcessing(true);
    setStatus("processing");
    setRoftco(emptyRoftco);
    setIsRevealing(false);

    try {
      const { data, error } = await supabase.functions.invoke("generate-roftco", {
        body: { message: input },
      });

      if (error) throw error;

      const result = data as ROFTCOData;
      setRoftco(result);
      setIsRevealing(true);
      setStatus("complete");
    } catch (err) {
      console.error("Generation error:", err);
      setStatus("error");
      toast({
        title: "SYSTEM ERROR",
        description: "Failed to parse neural dump. Retry protocol.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  }, [input, isProcessing]);

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

        {/* Brain dump input */}
        <div className="mb-6">
          <label className="font-mono-hud text-xs tracking-[0.2em] uppercase text-foreground/50 mb-2 block">
            Brain Dump Terminal
          </label>
          <div className="relative">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="AWAITING INPUT... Type your idea in any language — English, Malay, Rojak..."
              className="w-full min-h-[180px] bg-card border border-border text-foreground font-body text-sm p-4 resize-none
                placeholder:text-muted-foreground placeholder:font-mono-hud placeholder:text-xs placeholder:tracking-wider
                focus:outline-none focus:border-foreground focus:border-glow-cyan transition-all duration-300"
              disabled={isProcessing}
            />
            {/* Corner accents on textarea */}
            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-foreground/50 pointer-events-none" />
            <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-foreground/50 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-foreground/50 pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-foreground/50 pointer-events-none" />
          </div>
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
              disabled={!input.trim()}
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-mono-hud text-xs tracking-[0.2em] uppercase
                px-8 py-3 h-auto border border-primary/50 hover:border-glow-red transition-all duration-300
                disabled:opacity-30 disabled:cursor-not-allowed"
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
            Stark Industries — Internal Use Only
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
