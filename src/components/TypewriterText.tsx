import { motion } from "framer-motion";

interface TypewriterTextProps {
  text?: string;
  texts?: string[];
  interval?: number;
}

const TypewriterText = ({ text, texts, interval = 3000 }: TypewriterTextProps) => {
  if (texts && texts.length > 0) {
    // Rotating texts mode
    return (
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        <SimpleTypewriter text={texts[0]} />
      </motion.span>
    );
  }

  if (text) {
    return <SimpleTypewriter text={text} />;
  }

  return null;
};

const SimpleTypewriter = ({ text }: { text: string }) => {
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
          transition={{ delay: i * 0.015, duration: 0.1 }}
        >
          {char}
        </motion.span>
      ))}
    </motion.span>
  );
};

export default TypewriterText;
