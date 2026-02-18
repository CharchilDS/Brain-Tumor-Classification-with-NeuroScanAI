import { Brain } from "lucide-react";
import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="border-t border-border/50 bg-muted/30">
      <div className="container-wide px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 font-display font-bold text-lg mb-3">
              <Brain className="h-5 w-5 text-primary" />
              <span>NeuroScan<span className="text-primary">AI</span></span>
            </div>
            <p className="text-sm text-muted-foreground max-w-md">
              A demonstration of deep learning for brain MRI classification.
              This is a research prototype — not a diagnostic tool.
            </p>
          </div>
          <div>
            <h4 className="font-display font-semibold text-sm mb-3">Links</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/demo" className="hover:text-primary transition-colors">Try Demo</Link></li>
              <li><Link to="/about" className="hover:text-primary transition-colors">About</Link></li>
              <li><Link to="/faq" className="hover:text-primary transition-colors">FAQ</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-display font-semibold text-sm mb-3">Legal</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Privacy Policy</li>
              <li>Terms of Use</li>
              <li>Disclaimer</li>
            </ul>
          </div>
        </div>
        <div className="mt-10 pt-6 border-t border-border/50 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} NeuroScanAI. Demo purposes only. Not for clinical use.
        </div>
      </div>
    </footer>
  );
}
