import { motion, AnimatePresence } from "framer-motion";

type SystemStatus = "booting" | "ready" | "processing" | "complete" | "error" | "warning";

interface StatusIndicatorProps {
  status: SystemStatus;
}

const statusMessages: Record<SystemStatus, string> = {
  booting: "INITIALIZING SYSTEMS...",
  ready: "SYSTEM READY — AWAITING INPUT",
  processing: "PARSING NEURAL DUMP...",
  complete: "SEQUENCE COMPLETE",
  error: "SYSTEM ERROR — RETRY PROTOCOL",
  warning: "SYSTEM WARNING — CHECK CONFIG",
};

const StatusIndicator = ({ status }: StatusIndicatorProps) => {
  return (
    <div className="flex items-center gap-3 font-mono-hud text-xs tracking-[0.2em] uppercase">
      <motion.div
        className={`w-2 h-2 ${
          status === "error" ? "bg-primary" :
          status === "warning" ? "bg-[hsl(var(--warning))]" :
          status === "processing" ? "bg-foreground" :
          "bg-foreground"
        }`}
        animate={
          status === "processing"
            ? { opacity: [1, 0.2, 1] }
            : status === "booting"
            ? { opacity: [1, 0.3, 1] }
            : { opacity: 1 }
        }
        transition={
          status === "processing" || status === "booting"
            ? { duration: 0.8, repeat: Infinity }
            : {}
        }
      />
      <AnimatePresence mode="wait">
        <motion.span
          key={status}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 10 }}
          transition={{ duration: 0.2 }}
          className={status === "error" ? "text-primary" : status === "warning" ? "text-[hsl(var(--warning))]" : "text-foreground/70"}
        >
          {statusMessages[status]}
        </motion.span>
      </AnimatePresence>
    </div>
  );
};

export default StatusIndicator;
export type { SystemStatus };
