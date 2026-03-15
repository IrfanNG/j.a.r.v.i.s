import { motion } from "framer-motion";

interface HUDCardProps {
  label: string;
  content: string;
  index: number;
  isRevealing: boolean;
}

const HUDCard = ({ label, content, index, isRevealing }: HUDCardProps) => {
  const hasContent = content && content.trim().length > 0;
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
          content || <span className="text-muted-foreground italic">— awaiting data —</span>
        )}
      </div>
    </motion.div>
  );
};

const TypewriterText = ({ text }: { text: string }) => {
  return (
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {text.split("").map((char, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: i * 0.015, duration: 0.05 }}
        >
          {char}
        </motion.span>
      ))}
    </motion.span>
  );
};

export default HUDCard;
