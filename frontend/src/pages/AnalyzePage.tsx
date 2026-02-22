import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, RotateCcw, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import ImageUploader from "@/components/ImageUploader";
import ScanningOverlay from "@/components/ScanningOverlay";
import ResultDisplay from "@/components/ResultDisplay";
import FeedbackButtons from "@/components/FeedbackButtons";

interface AnalysisResult {
  prediction: string;
  confidence: number;
}

const AnalyzePage = () => {
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleImageSelect = useCallback((file: File) => {
    setSelectedImage(file);
    setResult(null);
    setError(null);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleClear = useCallback(() => {
    setSelectedImage(null);
    setImagePreview(null);
    setResult(null);
    setError(null);
  }, []);

  const analyzeImage = useCallback(async () => {
    if (!selectedImage) return;

    setIsAnalyzing(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", selectedImage);

    try {
      const response = await fetch("http://127.0.0.1:8000/predict", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Analysis failed. Please try again.");
      }

      const data = await response.json();
      
      // Add a minimum delay for better UX
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      setResult({
        prediction: data.prediction,
        confidence: data.confidence,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsAnalyzing(false);
    }
  }, [selectedImage]);

  const handleAnalyzeAnother = useCallback(() => {
    handleClear();
  }, [handleClear]);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-28 pb-12 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Back button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-8"
          >
            <Button
              variant="ghost"
              onClick={() => navigate("/")}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Button>
          </motion.div>

          {/* Page title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl font-bold font-display mb-4">
              Analyze Your Image
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Upload an image to detect whether it's authentic or has been manipulated.
            </p>
          </motion.div>

          {/* Main content - split view */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left side - Image */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-card p-6 rounded-2xl"
            >
              <h2 className="text-lg font-semibold font-display mb-4">
                Image Preview
              </h2>

              <div className="relative">
                {!selectedImage ? (
                  <ImageUploader
                    onImageSelect={handleImageSelect}
                    selectedImage={selectedImage}
                    onClear={handleClear}
                    disabled={isAnalyzing}
                  />
                ) : (
                  <div className="relative aspect-video rounded-xl overflow-hidden bg-muted">
                    {imagePreview && (
                      <img
                        src={imagePreview}
                        alt="Selected for analysis"
                        className="w-full h-full object-contain"
                      />
                    )}
                    <ScanningOverlay isScanning={isAnalyzing} />
                  </div>
                )}
              </div>

              {/* Action buttons */}
              {selectedImage && !result && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 flex items-center justify-center gap-4"
                >
                  <Button
                    variant="hero-outline"
                    onClick={handleClear}
                    disabled={isAnalyzing}
                  >
                    Choose Different Image
                  </Button>
                  <Button
                    variant="hero"
                    onClick={analyzeImage}
                    disabled={isAnalyzing}
                    className="min-w-[140px]"
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      "Analyze Image"
                    )}
                  </Button>
                </motion.div>
              )}

              {/* Analyze another button */}
              {result && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 flex justify-center"
                >
                  <Button
                    variant="hero-outline"
                    onClick={handleAnalyzeAnother}
                    className="gap-2"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Analyze Another Image
                  </Button>
                </motion.div>
              )}
            </motion.div>

            {/* Right side - Results */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="glass-card p-6 rounded-2xl"
            >
              <h2 className="text-lg font-semibold font-display mb-4">
                Analysis Results
              </h2>

              <AnimatePresence mode="wait">
                {!selectedImage ? (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center h-64 text-center"
                  >
                    <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                      <Loader2 className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <p className="text-muted-foreground">
                      Upload an image to see analysis results
                    </p>
                  </motion.div>
                ) : isAnalyzing ? (
                  <motion.div
                    key="analyzing"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center h-64"
                  >
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className="w-16 h-16 rounded-full border-4 border-primary/20 border-t-primary mb-6"
                    />
                    <motion.p
                      animate={{ opacity: [1, 0.5, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="text-lg font-medium"
                    >
                      Scanning image...
                    </motion.p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Analyzing statistical patterns and artifacts
                    </p>
                  </motion.div>
                ) : error ? (
                  <motion.div
                    key="error"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center h-64 text-center"
                  >
                    <div className="w-16 h-16 rounded-full bg-danger/10 flex items-center justify-center mb-4">
                      <span className="text-3xl">⚠️</span>
                    </div>
                    <p className="text-danger font-medium mb-2">Analysis Failed</p>
                    <p className="text-sm text-muted-foreground max-w-xs">
                      {error}
                    </p>
                    <Button
                      variant="outline"
                      onClick={analyzeImage}
                      className="mt-4"
                    >
                      Try Again
                    </Button>
                  </motion.div>
                ) : result ? (
                  <motion.div
                    key="result"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <ResultDisplay
                      prediction={result.prediction}
                      confidence={result.confidence}
                    />
                    <div className="mt-8 pt-6 border-t border-border">
                      <FeedbackButtons />
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="ready"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center h-64 text-center"
                  >
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                      <span className="text-3xl">🔍</span>
                    </div>
                    <p className="text-muted-foreground">
                      Click "Analyze Image" to start the detection
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AnalyzePage;
