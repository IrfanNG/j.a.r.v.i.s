import { motion } from "framer-motion";

interface ArcReactorSpinnerProps {
  size?: number;
}

const ArcReactorSpinner = ({ size = 100 }: ArcReactorSpinnerProps) => {
  return (
    <div 
      className="relative flex items-center justify-center p-4" 
      style={{ width: size, height: size, perspective: "1000px" }}
    >
      {/* Outer Glow */}
      <div className="absolute inset-0 bg-cyan-500/20 blur-2xl rounded-full" />

      {/* Main Container with 3D Rotation */}
      <motion.div
        className="relative w-full h-full flex items-center justify-center"
        animate={{ 
          rotateX: [0, 45, 0],
          rotateY: [0, 45, 0],
          rotateZ: 360
        }}
        transition={{ 
          duration: 10, 
          repeat: Infinity, 
          ease: "linear" 
        }}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Outer Ring */}
        <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full text-cyan-500/80 drop-shadow-[0_0_10px_rgba(6,182,212,0.8)]">
          <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="10 5" />
          <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="2.5" />
        </svg>

        {/* Core Segments */}
        <motion.svg 
          viewBox="0 0 100 100" 
          className="absolute inset-0 w-full h-full text-cyan-400"
          animate={{ rotate: -720 }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        >
          {[0, 40, 80, 120, 160, 200, 240, 280, 320].map((angle, i) => (
            <path
              key={i}
              d="M 50 15 A 35 35 0 0 1 65 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="4"
              strokeLinecap="round"
              transform={`rotate(${angle} 50 50)`}
              className="drop-shadow-[0_0_5px_rgba(34,211,238,1)]"
            />
          ))}
        </motion.svg>

        {/* Inner Core */}
        <div className="absolute w-[40%] h-[40%] rounded-full bg-cyan-400 shadow-[0_0_20px_rgba(34,211,238,1)] flex items-center justify-center border-2 border-cyan-100/50">
          <div className="w-[80%] h-[80%] rounded-full bg-black flex items-center justify-center overflow-hidden">
             <motion.div 
               className="w-full h-full bg-cyan-500/30"
               animate={{ opacity: [0.3, 0.8, 0.3] }}
               transition={{ duration: 1, repeat: Infinity }}
             />
          </div>
        </div>
      </motion.div>

      {/* Static Inner Glow */}
      <div className="absolute w-2 h-2 bg-white rounded-full shadow-[0_0_15px_rgba(255,255,255,1)]" />
    </div>
  );
};

export default ArcReactorSpinner;
