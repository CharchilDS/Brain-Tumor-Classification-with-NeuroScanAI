import { AlertTriangle, X } from "lucide-react";
import { useState } from "react";

export function DisclaimerBanner() {
  const [visible, setVisible] = useState(true);
  if (!visible) return null;

  return (
    <div className="disclaimer-bar py-2 px-4 flex items-center justify-center gap-2 text-sm" role="alert">
      <AlertTriangle className="h-4 w-4 shrink-0" />
      <span className="font-medium">Demo only.</span>
      <span>Not medical advice. Always consult a qualified clinician.</span>
      <button
        onClick={() => setVisible(false)}
        className="ml-auto p-1 rounded hover:bg-amber-100 transition-colors"
        aria-label="Dismiss disclaimer"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
