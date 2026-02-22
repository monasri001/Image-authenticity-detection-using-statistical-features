import { motion } from "framer-motion";

interface ScanningOverlayProps {
  isScanning: boolean;
}

const ScanningOverlay = ({ isScanning }: ScanningOverlayProps) => {
  if (!isScanning) return null;

  return (
    <div className="absolute inset-0 overflow-hidden rounded-xl">
      {/* Scanning line */}
      <motion.div
        className="absolute left-0 right-0 h-1 scan-line"
        style={{
          boxShadow: "0 0 20px 10px hsl(340 70% 65% / 0.3)",
        }}
        animate={{
          top: ["-5%", "105%"],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      {/* Grid overlay */}
      <div className="absolute inset-0 grid-pattern opacity-40" />

      {/* Corner brackets */}
      <div className="absolute inset-4 border-2 border-primary/40 rounded-lg">
        {/* Top left */}
        <motion.div 
          className="absolute -top-0.5 -left-0.5 w-6 h-6 border-t-2 border-l-2 border-primary rounded-tl-lg"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
        {/* Top right */}
        <motion.div 
          className="absolute -top-0.5 -right-0.5 w-6 h-6 border-t-2 border-r-2 border-primary rounded-tr-lg"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
        />
        {/* Bottom left */}
        <motion.div 
          className="absolute -bottom-0.5 -left-0.5 w-6 h-6 border-b-2 border-l-2 border-primary rounded-bl-lg"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: 0.6 }}
        />
        {/* Bottom right */}
        <motion.div 
          className="absolute -bottom-0.5 -right-0.5 w-6 h-6 border-b-2 border-r-2 border-primary rounded-br-lg"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: 0.9 }}
        />
      </div>

      {/* Pulsing overlay */}
      <motion.div
        className="absolute inset-0 bg-primary/5"
        animate={{ opacity: [0, 0.1, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      />

      {/* Data points animation */}
      {Array.from({ length: 8 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-primary rounded-full"
          style={{
            left: `${15 + (i % 4) * 25}%`,
            top: `${20 + Math.floor(i / 4) * 60}%`,
          }}
          animate={{
            scale: [0, 1, 0],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            delay: i * 0.2,
          }}
        />
      ))}
    </div>
  );
};

export default ScanningOverlay;
