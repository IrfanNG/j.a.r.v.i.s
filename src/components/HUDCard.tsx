import { motion } from "framer-motion";
import { GLOSSARY_DATA } from "@/lib/glossary-data";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import TypewriterText from "@/components/TypewriterText";

interface HUDCardProps {
  label: string;
  content: string;
  index: number;
  isRevealing: boolean;
}

const HUDCard = ({ label, content, index, isRevealing }: HUDCardProps) => {
  const hasContent = content && content.trim().length > 0;

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
      className={`relative border bg-card p-4 min-h-[140px] group transition-all duration-300 ${
        hasContent ? "border-foreground/40 border-glow-cyan" : "border-border hover:border-glow-cyan"
      }`}
    >
      {/* Corner brackets */}
      <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-foreground" />
      <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-foreground" />
      <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-foreground" />
      <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-foreground" />

      {/* Label */}
      <div className="font-mono-hud text-xs tracking-[0.3em] uppercase text-foreground mb-3 flex items-center gap-2">
        <span className="w-1.5 h-1.5 bg-foreground inline-block" />
        {label}
      </div>

      {/* Content */}
      <div className="font-body text-sm text-foreground/80 leading-relaxed whitespace-pre-wrap">
        {isRevealing ? (
          <TypewriterText text={content} />
        ) : (
          renderContent(content)
        )}
      </div>
    </motion.div>
  );
};

export default HUDCard;
