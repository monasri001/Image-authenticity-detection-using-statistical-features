import { motion } from "framer-motion";
import { ShieldCheck, ShieldAlert, AlertTriangle } from "lucide-react";

interface ResultDisplayProps {
  prediction: string;
  confidence: number; // still used internally
}

const ResultDisplay = ({ prediction, confidence }: ResultDisplayProps) => {
  const isReal = prediction.toUpperCase() === "REAL";
  const isLikelyManipulated = confidence < 0.6 && confidence >= 0.4;

  const getIcon = () => {
    if (isLikelyManipulated) {
      return <AlertTriangle className="w-16 h-16" />;
    }
    return isReal 
      ? <ShieldCheck className="w-16 h-16" />
      : <ShieldAlert className="w-16 h-16" />;
  };

  const getColors = () => {
    if (isLikelyManipulated) {
      return {
        bg: "bg-warning/10",
        text: "text-warning",
        border: "border-warning/30",
      };
    }
    return isReal
      ? {
          bg: "bg-success/10",
          text: "text-success",
          border: "border-success/30",
        }
      : {
          bg: "bg-danger/10",
          text: "text-danger",
          border: "border-danger/30",
        };
  };

  const colors = getColors();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      {/* Main Result */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        className={`flex flex-col items-center justify-center p-8 rounded-2xl border-2 ${colors.bg} ${colors.border}`}
      >
        <motion.div
          initial={{ rotate: -180, opacity: 0 }}
          animate={{ rotate: 0, opacity: 1 }}
          transition={{ delay: 0.4, type: "spring" }}
          className={colors.text}
        >
          {getIcon()}
        </motion.div>

        <motion.h2
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className={`mt-4 text-4xl font-bold font-display ${colors.text}`}
        >
          {isLikelyManipulated ? "UNCERTAIN" : prediction.toUpperCase()}
        </motion.h2>

        <motion.p
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-2 text-muted-foreground text-center max-w-xs"
        >
          {isLikelyManipulated
            ? "The analysis is inconclusive. The image may have been modified."
            : isReal
              ? "This image appears to be authentic and unmodified."
              : "This image shows signs of manipulation or AI generation."
          }
        </motion.p>
      </motion.div>

      {/* Technical Details */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="p-4 rounded-xl bg-muted/50 border border-border/50"
      >
        <h4 className="text-sm font-medium text-muted-foreground mb-2">
          Analysis Method
        </h4>
        <p className="text-xs text-muted-foreground leading-relaxed">
          This result was obtained using statistical image forensics and machine learning 
          algorithms that analyze patterns and artifacts in the image data, rather than 
          deep learning on raw pixels.
        </p>
      </motion.div>
    </motion.div>
  );
};

export default ResultDisplay;
