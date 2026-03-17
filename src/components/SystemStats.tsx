import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export const SystemStats = () => {
  const [stats, setStats] = useState({
    neuralLoad: 42,
    latency: 12,
    uptime: 0,
  });

  useEffect(() => {
    const updateStats = () => {
      setStats((prev) => ({
        neuralLoad: Math.min(100, Math.max(10, prev.neuralLoad + (Math.random() * 20 - 10))),
        latency: Math.min(150, Math.max(5, prev.latency + (Math.random() * 10 - 5))),
        uptime: prev.uptime + 1,
      }));
    };

    const interval = setInterval(updateStats, 2000);
    return () => clearInterval(interval);
  }, []);

  const formatUptime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 font-mono-hud text-[10px] uppercase tracking-widest text-cyan-500/80 bg-black/40 p-3 border border-cyan-500/20 rounded-sm backdrop-blur-md">
      <div className="flex items-center gap-2">
        <span className="text-cyan-500/50">NEURAL LOAD:</span>
        <div className="w-16 h-1 bg-cyan-900/50 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]"
            animate={{ width: `${stats.neuralLoad}%` }}
            transition={{ duration: 1, ease: "linear" }}
          />
        </div>
        <span className="w-8 text-right">{Math.round(stats.neuralLoad)}%</span>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-cyan-500/50">LINK LATENCY:</span>
        <span className="w-8 text-right">{Math.round(stats.latency)}ms</span>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-cyan-500/50">SYS UPTIME:</span>
        <span className="w-16">{formatUptime(stats.uptime)}</span>
      </div>
    </div>
  );
};
