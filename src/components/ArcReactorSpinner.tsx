import { motion } from "framer-motion";

interface ArcReactorSpinnerProps {
  size?: number;
}

const ArcReactorSpinner = ({ size = 80 }: ArcReactorSpinnerProps) => {
  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      {/* Outer ring */}
      <motion.svg
        viewBox="0 0 100 100"
        className="absolute inset-0 w-full h-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      >
        <circle cx="50" cy="50" r="45" fill="none" stroke="hsl(180 100% 50% / 0.15)" strokeWidth="2" />
        <path
          d="M 50 5 A 45 45 0 0 1 95 50"
          fill="none"
          stroke="hsl(180 100% 50%)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <path
          d="M 50 95 A 45 45 0 0 1 5 50"
          fill="none"
          stroke="hsl(180 100% 50%)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </motion.svg>

      {/* Inner ring - counter rotation */}
      <motion.svg
        viewBox="0 0 100 100"
        className="absolute w-[65%] h-[65%]"
        animate={{ rotate: -360 }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
      >
        <circle cx="50" cy="50" r="40" fill="none" stroke="hsl(180 100% 50% / 0.1)" strokeWidth="2" />
        <path
          d="M 50 10 A 40 40 0 0 1 90 50"
          fill="none"
          stroke="hsl(354 85% 42%)"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </motion.svg>

      {/* Center dot */}
      <motion.div
        className="w-2 h-2 bg-foreground rounded-full glow-cyan"
        animate={{ scale: [1, 1.3, 1] }}
        transition={{ duration: 1, repeat: Infinity }}
      />
    </div>
  );
};

export default ArcReactorSpinner;
