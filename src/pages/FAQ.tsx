import { PageTransition } from "@/components/PageTransition";
import { ScrollReveal } from "@/components/ScrollReveal";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "What does this model do?",
    a: "The model classifies brain MRI scans into four categories: Glioma, Meningioma, Pituitary tumor, and No Tumor. It outputs a probability distribution across these classes and highlights the region of the image most relevant to its prediction using Grad-CAM.",
  },
  {
    q: "Is this a real diagnostic tool?",
    a: "No. This is a research demonstration with simulated predictions. It has not been validated for clinical use and has not received regulatory clearance. Never use this tool to make medical decisions.",
  },
  {
    q: "What are the model's limitations?",
    a: "The model was trained on a limited public dataset and may not generalize to all scanner types, patient populations, or pathologies. It can only classify the four categories listed above and cannot detect other conditions. Confidence scores are model-internal estimates and do not correspond to clinical certainty.",
  },
  {
    q: "Does my image leave the browser?",
    a: "No. In this mock demo, all processing is simulated locally. No image data is transmitted to any server. A real deployment would require secure, HIPAA-compliant infrastructure.",
  },
  {
    q: "What dataset was used?",
    a: "The model was trained on a publicly available brain MRI dataset containing approximately 7,000 images across four classes (mock reference). Data augmentation techniques including rotation, flipping, and brightness adjustment were used to improve generalization.",
  },
  {
    q: "What should I do if I'm concerned about a real brain MRI?",
    a: "Please consult a qualified radiologist or neurologist immediately. This tool cannot and should not replace professional medical evaluation. Early clinical consultation is always the recommended course of action.",
  },
  {
    q: "How was the model evaluated?",
    a: "The model was evaluated using five-fold stratified cross-validation on a held-out test set. Key metrics include overall accuracy (96.8%), per-class precision, recall, F1-score, and ROC-AUC. These are mock metrics for demonstration purposes.",
  },
  {
    q: "Can this be deployed in a hospital?",
    a: "Not in its current form. A clinical deployment would require extensive validation studies, regulatory clearance (e.g., FDA 510(k) or CE marking), integration with hospital PACS systems, and ongoing monitoring for model drift and bias.",
  },
];

export default function FAQ() {
  return (
    <PageTransition>
      <div className="section-padding min-h-[80vh]">
        <div className="container-narrow">
          <ScrollReveal>
            <h1 className="text-3xl sm:text-4xl font-display font-bold mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-muted-foreground mb-10 max-w-2xl">
              Common questions about the NeuroScanAI demo, its limitations, and responsible use.
            </p>
          </ScrollReveal>

          <ScrollReveal>
            <Accordion type="single" collapsible className="space-y-3">
              {faqs.map((faq, i) => (
                <AccordionItem
                  key={i}
                  value={`faq-${i}`}
                  className="glass-panel px-6 border border-border/50 rounded-xl"
                >
                  <AccordionTrigger className="text-left font-display font-semibold text-sm sm:text-base hover:no-underline py-5">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground pb-5 leading-relaxed">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </ScrollReveal>
        </div>
      </div>
    </PageTransition>
  );
}
