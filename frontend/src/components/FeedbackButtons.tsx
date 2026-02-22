import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ThumbsUp, ThumbsDown, Check } from "lucide-react";
import { Button } from "./ui/button";

const FeedbackButtons = () => {
  const [feedback, setFeedback] = useState<"up" | "down" | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleFeedback = (type: "up" | "down") => {
    setFeedback(type);
    setSubmitted(true);
    
    // Reset after animation
    setTimeout(() => {
      setSubmitted(false);
    }, 3000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1 }}
      className="flex flex-col items-center gap-3"
    >
      <p className="text-sm text-muted-foreground">Was this result helpful?</p>
      
      <div className="flex items-center gap-3">
        <AnimatePresence mode="wait">
          {submitted ? (
            <motion.div
              key="thanks"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex items-center gap-2 text-success"
            >
              <Check className="w-5 h-5" />
              <span className="text-sm font-medium">Thanks for your feedback!</span>
            </motion.div>
          ) : (
            <motion.div
              key="buttons"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-3"
            >
              <Button
                variant="icon"
                size="icon"
                onClick={() => handleFeedback("up")}
                className={`
                  ${feedback === "up" ? "bg-success/20 border-success text-success" : ""}
                `}
              >
                <ThumbsUp className="w-4 h-4" />
              </Button>
              
              <Button
                variant="icon"
                size="icon"
                onClick={() => handleFeedback("down")}
                className={`
                  ${feedback === "down" ? "bg-danger/20 border-danger text-danger" : ""}
                `}
              >
                <ThumbsDown className="w-4 h-4" />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default FeedbackButtons;
