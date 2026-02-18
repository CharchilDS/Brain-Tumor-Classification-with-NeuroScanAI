import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Brain, Upload, Cpu, BarChart3, ShieldCheck, Activity, Target, Layers, AlertTriangle } from "lucide-react";
import { ScrollReveal } from "@/components/ScrollReveal";
import { PageTransition } from "@/components/PageTransition";
import { MOCK_METRICS, TUMOR_CLASSES } from "@/lib/mockInference";
import heroBrain from "@/assets/hero-brain.jpg";

const steps = [
  { icon: Upload, title: "Upload MRI", desc: "Drag & drop a brain MRI scan in PNG or JPG format." },
  { icon: Cpu, title: "Preprocess", desc: "Image is resized and normalized for the neural network." },
  { icon: Brain, title: "Predict", desc: "A trained CNN classifies the scan into one of four categories." },
  { icon: BarChart3, title: "Explain", desc: "View probability scores and Grad-CAM explainability overlays." },
];

const architectureCards = [
  { icon: Layers, title: "EfficientNet-B0", desc: "Lightweight backbone pretrained on ImageNet, fine-tuned on 7,000+ MRI scans." },
  { icon: Target, title: "Multi-class Head", desc: "Softmax output layer for Glioma, Meningioma, Pituitary, and No Tumor classes." },
  { icon: Activity, title: "Grad-CAM", desc: "Gradient-weighted class activation maps highlight regions driving the prediction." },
];

export default function Index() {
  return (
    <PageTransition>
      {/* Hero */}
      <section className="relative overflow-hidden gradient-hero min-h-[85vh] flex items-center">
        <div className="absolute inset-0">
          <img src={heroBrain} alt="" className="w-full h-full object-cover opacity-30 mix-blend-lighten" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />
        </div>
        <div className="relative z-10 container-wide px-4 sm:px-6 py-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-6 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-medium">
              <ShieldCheck className="h-3.5 w-3.5" />
              Research Demo — Not for Clinical Use
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-primary-foreground leading-tight mb-6">
              Brain Tumor MRI{" "}
              <span className="gradient-text">Classification</span>
            </h1>
            <p className="text-lg text-primary-foreground/70 max-w-xl mb-8">
              Explore how deep learning can assist in identifying brain tumor types from MRI scans.
              Upload an image and see the model's prediction in seconds.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/demo"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl gradient-accent text-primary-foreground font-semibold hover:opacity-90 transition-opacity pulse-glow"
              >
                Try Demo <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="#how-it-works"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-primary-foreground/20 text-primary-foreground/80 font-medium hover:bg-primary-foreground/5 transition-colors"
              >
                Learn More
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="section-padding">
        <div className="container-wide">
          <ScrollReveal>
            <h2 className="text-3xl font-display font-bold text-center mb-4">How It Works</h2>
            <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-14">
              A four-step pipeline from raw MRI scan to actionable insights.
            </p>
          </ScrollReveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((s, i) => (
              <ScrollReveal key={s.title} delay={i * 0.1}>
                <div className="card-elevated p-6 text-center h-full">
                  <div className="w-12 h-12 mx-auto mb-4 rounded-xl gradient-accent flex items-center justify-center">
                    <s.icon className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <div className="text-xs font-bold text-primary mb-2">STEP {i + 1}</div>
                  <h3 className="font-display font-semibold text-lg mb-2">{s.title}</h3>
                  <p className="text-sm text-muted-foreground">{s.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Model Overview */}
      <section className="section-padding bg-muted/30">
        <div className="container-wide">
          <ScrollReveal>
            <h2 className="text-3xl font-display font-bold text-center mb-4">Model Architecture</h2>
            <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-14">
              Built on proven architectures, fine-tuned for brain MRI classification.
            </p>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {architectureCards.map((c, i) => (
              <ScrollReveal key={c.title} delay={i * 0.1}>
                <div className="glass-panel p-8 h-full">
                  <c.icon className="h-8 w-8 text-primary mb-4" />
                  <h3 className="font-display font-semibold text-lg mb-2">{c.title}</h3>
                  <p className="text-sm text-muted-foreground">{c.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Performance */}
      <section className="section-padding">
        <div className="container-wide">
          <ScrollReveal>
            <h2 className="text-3xl font-display font-bold text-center mb-4">Performance Metrics</h2>
            <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-14">
              Evaluated on a held-out test set of 1,200 MRI scans.
            </p>
          </ScrollReveal>
          <ScrollReveal>
            <div className="glass-panel-strong p-8 max-w-4xl mx-auto">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
                <div className="text-center">
                  <div className="text-3xl font-display font-bold text-primary">{MOCK_METRICS.accuracy}%</div>
                  <div className="text-sm text-muted-foreground mt-1">Overall Accuracy</div>
                </div>
                {TUMOR_CLASSES.map((c) => (
                  <div key={c} className="text-center">
                    <div className="text-2xl font-display font-bold">{MOCK_METRICS.rocAuc[c]}</div>
                    <div className="text-sm text-muted-foreground mt-1">{c} AUC</div>
                  </div>
                ))}
              </div>

              {/* Mini confusion matrix */}
              <h4 className="font-display font-semibold mb-3 text-sm">Confusion Matrix (Test Set)</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr>
                      <th className="p-2 text-left text-muted-foreground font-medium">Actual ↓ / Pred →</th>
                      {TUMOR_CLASSES.map((c) => (
                        <th key={c} className="p-2 text-center font-medium">{c}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {TUMOR_CLASSES.map((row, ri) => (
                      <tr key={row} className="border-t border-border/50">
                        <td className="p-2 font-medium">{row}</td>
                        {MOCK_METRICS.confusionMatrix[ri].map((val, ci) => (
                          <td
                            key={ci}
                            className={`p-2 text-center ${ri === ci ? "font-bold text-primary" : "text-muted-foreground"}`}
                          >
                            {val}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Responsible Use */}
      <section className="section-padding bg-muted/30">
        <div className="container-narrow">
          <ScrollReveal>
            <div className="glass-panel p-8 md:p-12 text-center">
              <AlertTriangle className="h-10 w-10 text-amber-500 mx-auto mb-4" />
              <h2 className="text-2xl font-display font-bold mb-4">Responsible Use & Limitations</h2>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                This tool is a <strong>research demonstration</strong> only. It has not been validated for clinical
                decision-making. Model predictions carry inherent uncertainty and should
                <strong> never</strong> replace a qualified radiologist's assessment.
              </p>
              <ul className="text-left text-sm text-muted-foreground max-w-lg mx-auto space-y-2 mb-8">
                <li className="flex items-start gap-2">
                  <ShieldCheck className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  No image data leaves your browser in this demo.
                </li>
                <li className="flex items-start gap-2">
                  <ShieldCheck className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  Results use probabilistic language ("model suggests", "likelihood").
                </li>
                <li className="flex items-start gap-2">
                  <ShieldCheck className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  Always consult a qualified clinician for medical advice.
                </li>
              </ul>
              <Link
                to="/faq"
                className="inline-flex items-center gap-2 text-primary font-medium hover:underline"
              >
                Read FAQ & Limitations <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Mock logos */}
      <section className="section-padding">
        <div className="container-wide text-center">
          <ScrollReveal>
            <p className="text-sm text-muted-foreground mb-8">Trusted by research teams at</p>
            <div className="flex flex-wrap justify-center gap-8 opacity-40">
              {["Stanford Medical", "MIT CSAIL", "Johns Hopkins", "Mayo Clinic", "NIH"].map((name) => (
                <div key={name} className="font-display font-bold text-lg">{name}</div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>
    </PageTransition>
  );
}
