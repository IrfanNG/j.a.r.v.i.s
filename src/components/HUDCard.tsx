import { motion } from "framer-motion";
import { GLOSSARY_DATA } from "@/lib/glossary-data";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import TypewriterText from "@/components/TypewriterText";

import { useState, useEffect } from "react";

interface HUDCardProps {
  label: string;
  content: string;
  index: number;
  isRevealing: boolean;
}

const ROFTCO_EXPLAINERS: Record<string, string> = {
  "Role": "Defines the specific character, persona, or expertise the AI should adopt during the task.",
  "Objective": "The primary goal or target outcome that needs to be achieved in this generation.",
  "Features": "The specific functional requirements, components, or deliverables to be implemented.",
  "Tech Stack": "The technical architecture, frameworks, and libraries to be used for development.",
  "Constraint": "Design limits, performance requirements, or specific rules that must be followed.",
  "Output Format": "The final structure, file type, or visual presentation of the generated content.",
};

const HUDCard = ({ label, content, index, isRevealing }: HUDCardProps) => {
  const [isTyping, setIsTyping] = useState(false);
  const hasContent = content && content.trim().length > 0;

  useEffect(() => {
    if (isRevealing && hasContent) {
      setIsTyping(true);
      // Determine typing duration based on content length
      const duration = Math.min(2000, content.length * 20); 
      const timer = setTimeout(() => setIsTyping(false), duration);
      return () => clearTimeout(timer);
    }
  }, [isRevealing, hasContent, content]);

  const renderContent = (text: string) => {
    if (!text) return <span className="text-muted-foreground italic">— awaiting data —</span>;

    // Create a regex to find glossary terms (case-insensitive)
    const terms = GLOSSARY_DATA.map(g => g.term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
    const regex = new RegExp(`(${terms})`, 'gi');
    
    const parts = text.split(regex);

    return parts.map((part, i) => {
      const glossaryItem = GLOSSARY_DATA.find(
        g => g.term.toLowerCase() === part.toLowerCase()
      );

      if (glossaryItem) {
        return (
          <Tooltip key={i}>
            <TooltipTrigger asChild>
              <span className="cursor-help border-b border-dotted border-foreground/50 text-foreground hover:text-cyan-400 transition-colors">
                {part}
              </span>
            </TooltipTrigger>
            <TooltipContent className="bg-card border-foreground/20 text-foreground px-3 py-2 max-w-[200px]">
              <div className="flex flex-col gap-1">
                <span className="font-mono-hud text-[10px] uppercase text-foreground/40">{glossaryItem.category}</span>
                <p className="text-xs leading-relaxed">{glossaryItem.definition}</p>
              </div>
            </TooltipContent>
          </Tooltip>
        );
      }
      return part;
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.15, duration: 0.5 }}
      className={`relative border p-4 min-h-[140px] group transition-all duration-300 backdrop-blur-md ${
        hasContent ? "bg-black/60 border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.15)] bg-gradient-to-br from-cyan-900/10 to-transparent" : "bg-black/40 border-cyan-900/40 hover:border-cyan-500/50"
      }`}
    >
      {/* Corner brackets */}
      <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-cyan-500/70" />
      <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-cyan-500/70" />
      <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-cyan-500/70" />
      <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-cyan-500/70" />

      {/* Label */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="font-mono-hud text-xs tracking-[0.3em] uppercase text-cyan-400 mb-3 flex items-center gap-2 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)] cursor-help">
              <span className="w-1.5 h-1.5 bg-cyan-400 inline-block shadow-[0_0_5px_rgba(34,211,238,1)]" />
              {label}
            </div>
          </TooltipTrigger>
          <TooltipContent className="bg-black/90 border-cyan-500/50 text-cyan-100 px-3 py-2 max-w-[250px] backdrop-blur-md">
            <p className="font-mono-hud text-[10px] tracking-wider leading-relaxed">
              {ROFTCO_EXPLAINERS[label] || "Neural processing node."}
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {/* Content */}
      <div className="font-body text-sm text-cyan-50/80 leading-relaxed whitespace-pre-wrap">
        {isTyping ? (
          <TypewriterText text={content} />
        ) : (
          renderContent(content)
        )}
      </div>
    </motion.div>
  );
};

export default HUDCard;
