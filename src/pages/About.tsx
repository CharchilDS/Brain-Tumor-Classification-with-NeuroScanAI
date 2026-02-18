import { Brain, Database, ShieldCheck, Workflow, AlertTriangle, Microscope } from "lucide-react";
import { PageTransition } from "@/components/PageTransition";
import { ScrollReveal } from "@/components/ScrollReveal";

const pipelineSteps = [
  { icon: Database, title: "Dataset", desc: "Trained on ~7,000 MRI scans across four classes from a publicly available research dataset (mock reference)." },
  { icon: Workflow, title: "Preprocessing", desc: "Images are resized to 224×224, normalized, and augmented with flips, rotations, and brightness adjustments." },
  { icon: Brain, title: "Training", desc: "EfficientNet-B0 backbone, fine-tuned for 50 epochs with AdamW optimizer and cosine annealing scheduler." },
  { icon: Microscope, title: "Evaluation", desc: "Five-fold cross-validation with stratified splits. Final model selected by best macro F1-score on the validation set." },
];

export default function About() {
  return (
    <PageTransition>
      <div className="section-padding min-h-[80vh]">
        <div className="container-narrow">
          <ScrollReveal>
            <h1 className="text-3xl sm:text-4xl font-display font-bold mb-4">About This Project</h1>
            <p className="text-muted-foreground max-w-2xl mb-12">
              NeuroScanAI is a research demonstration exploring how deep learning can assist
              in classifying brain tumors from MRI imagery. It is <strong>not</strong> a medical
              device and should not be used for clinical decision-making.
            </p>
          </ScrollReveal>

          {/* Pipeline */}
          <ScrollReveal>
            <h2 className="text-2xl font-display font-bold mb-6">Pipeline Overview</h2>
          </ScrollReveal>
          <div className="space-y-4 mb-16">
            {pipelineSteps.map((step, i) => (
              <ScrollReveal key={step.title} delay={i * 0.08}>
                <div className="card-elevated p-6 flex gap-4">
                  <div className="w-10 h-10 rounded-xl gradient-accent flex items-center justify-center shrink-0">
                    <step.icon className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-display font-semibold mb-1">{step.title}</h3>
                    <p className="text-sm text-muted-foreground">{step.desc}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>

          {/* Ethical considerations */}
          <ScrollReveal>
            <div className="glass-panel-strong p-8 md:p-10">
              <div className="flex items-center gap-3 mb-6">
                <ShieldCheck className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-display font-bold">Ethical Considerations</h2>
              </div>
              <div className="space-y-4 text-sm text-muted-foreground">
                <p>
                  <strong className="text-foreground">Bias & Fairness:</strong> The training data is drawn from a limited number of institutions
                  and may not represent the full diversity of patient demographics. Model performance
                  may vary across populations.
                </p>
                <p>
                  <strong className="text-foreground">Transparency:</strong> We provide Grad-CAM overlays to show which image
                  regions the model attends to. However, saliency maps are approximate and should not
                  be treated as ground truth.
                </p>
                <p>
                  <strong className="text-foreground">Intended Use:</strong> This tool is intended for educational and research
                  purposes only. It has not undergone regulatory review (e.g., FDA, CE marking) and
                  must not be used to make or influence clinical decisions.
                </p>
                <p>
                  <strong className="text-foreground">Privacy:</strong> In this demo, no image data leaves your browser.
                  A production deployment would require strict HIPAA/GDPR compliance,
                  de-identification protocols, and secure infrastructure.
                </p>
              </div>
              <div className="mt-6 flex items-start gap-2 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-sm">
                <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                <span>Always consult a qualified clinician for medical decisions.</span>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </PageTransition>
  );
}
