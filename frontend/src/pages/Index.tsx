import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Sparkles, Brain, BarChart3, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import AnimatedBackground from "@/components/AnimatedBackground";
import Header from "@/components/Header";

const Index = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Brain,
      title: "Statistical Analysis",
      description: "Uses advanced statistical patterns to detect manipulations",
    },
    {
      icon: BarChart3,
      title: "Confidence Scoring",
      description: "Get precise Statistical levels for every analysis",
    },
    {
      icon: Shield,
      title: "No Deep Learning",
      description: "Analyzes image artifacts, not raw pixel data",
    },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      <AnimatedBackground />
      <Header />

      {/* Hero Section */}
      <main className="relative z-10 pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8"
          >
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">AI-Powered Image Forensics</span>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-5xl md:text-7xl font-bold font-display leading-tight mb-6"
          >
            Image{" "}
            <span className="gradient-text">Authenticity</span>
            <br />
            Detection
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Detect whether an image is real or manipulated using statistical 
            image forensics and machine learning — no deep learning on raw pixels.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button
              variant="hero"
              size="xl"
              onClick={() => navigate("/analyze")}
              className="group"
            >
              Upload Image
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Button>
            
            <Button
              variant="hero-outline"
              size="xl"
              onClick={() => {
                document.getElementById("features")?.scrollIntoView({ 
                  behavior: "smooth" 
                });
              }}
            >
              Learn More
            </Button>
          </motion.div>
        </div>

        {/* Features Section */}
        <motion.section
          id="features"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="max-w-5xl mx-auto mt-32"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold font-display mb-4">
              How It Works
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Our system analyzes statistical patterns and image artifacts 
              to determine authenticity with high confidence.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                className="glass-card p-8 rounded-2xl hover-lift"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold font-display mb-3">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Trust Indicators */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="max-w-4xl mx-auto mt-24 text-center"
        >
          <div className="glass-card p-8 rounded-2xl">
            <div className="grid grid-cols-3 divide-x divide-border">
              <div className="px-6">
                <div className="text-3xl font-bold font-display gradient-text">70+%</div>
                <div className="text-sm text-muted-foreground mt-1">Detection Accuracy</div>
              </div>
              <div className="px-6">
                <div className="text-3xl font-bold font-display gradient-text">&lt;2s</div>
                <div className="text-sm text-muted-foreground mt-1">Average Analysis Time</div>
              </div>
              <div className="px-6">
                <div className="text-3xl font-bold font-display gradient-text">15K+</div>
                <div className="text-sm text-muted-foreground mt-1">Images Analyzed</div>
              </div>
            </div>
          </div>
        </motion.section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-8 px-6 border-t border-border/50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            © 2024 AuthentiScan. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Privacy
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Terms
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
