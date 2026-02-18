import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Image as ImageIcon, X, Loader2, AlertTriangle, Wifi, WifiOff } from "lucide-react";
import { PageTransition } from "@/components/PageTransition";
import { generateMockInference, type InferenceResult } from "@/lib/mockInference";
import { predictImage, isApiAvailable } from "@/lib/api";

export default function Demo() {
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [apiConnected, setApiConnected] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Check API connectivity on mount
  useEffect(() => {
    const checkApi = async () => {
      const available = await isApiAvailable();
      setApiConnected(available);
    };
    checkApi();
  }, []);

  const handleFile = useCallback((f: File) => {
    if (!f.type.startsWith("image/")) return;
    setFile(f);
    setError(null);
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(f);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const f = e.dataTransfer.files[0];
      if (f) handleFile(f);
    },
    [handleFile]
  );

  const handleRunPrediction = useCallback(async () => {
    if (!file) return;
    
    setProcessing(true);
    setError(null);
    
    try {
      let result: InferenceResult;
      
      if (apiConnected) {
        // Use real API
        result = await predictImage(file);
      } else {
        // Fallback to mock
        result = generateMockInference();
        // Simulate processing time for mock
        await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 1000));
      }
      
      // Store result + image in sessionStorage for Results page
      sessionStorage.setItem("inferenceResult", JSON.stringify(result));
      sessionStorage.setItem("isRealPrediction", String(apiConnected));
      if (preview) sessionStorage.setItem("uploadedImage", preview);
      
      navigate("/results");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Prediction failed";
      setError(message);
      setProcessing(false);
    }
  }, [file, navigate, preview, apiConnected]);

  const clearFile = () => {
    setFile(null);
    setPreview(null);
    setError(null);
  };

  return (
    <PageTransition>
      <div className="section-padding min-h-[80vh]">
        <div className="container-narrow">
          <div className="text-center mb-12">
            <h1 className="text-3xl sm:text-4xl font-display font-bold mb-4">
              Upload MRI Scan
            </h1>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Drop a brain MRI image to get the model's prediction.
              {apiConnected === false && " Running in demo mode."}
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            {/* API Status Indicator */}
            <div className={`flex items-center gap-2 p-3 mb-4 rounded-xl text-sm ${
              apiConnected === null 
                ? "bg-muted text-muted-foreground"
                : apiConnected 
                  ? "bg-green-50 border border-green-200 text-green-800"
                  : "bg-amber-50 border border-amber-200 text-amber-800"
            }`}>
              {apiConnected === null ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Checking model connection...</span>
                </>
              ) : apiConnected ? (
                <>
                  <Wifi className="h-4 w-4" />
                  <span><strong>Model connected.</strong> Real-time predictions enabled.</span>
                </>
              ) : (
                <>
                  <WifiOff className="h-4 w-4" />
                  <span><strong>Demo mode.</strong> Results are simulated. Connect backend for real predictions.</span>
                </>
              )}
            </div>

            {/* Disclaimer */}
            <div className="flex items-start gap-2 p-4 mb-6 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-sm">
              <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>
                <strong>Research tool only.</strong> This is not medical advice.
                Always consult a qualified clinician for diagnosis.
              </span>
            </div>

            {/* Error message */}
            {error && (
              <div className="flex items-start gap-2 p-4 mb-6 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm">
                <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                <span><strong>Error:</strong> {error}</span>
              </div>
            )}

            <AnimatePresence mode="wait">
              {!file ? (
                <motion.div
                  key="upload"
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                >
                  <label
                    onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={handleDrop}
                    className={`flex flex-col items-center justify-center p-16 border-2 border-dashed rounded-2xl cursor-pointer transition-all ${
                      dragOver
                        ? "border-primary bg-primary/5 scale-[1.02]"
                        : "border-border hover:border-primary/50 hover:bg-muted/50"
                    }`}
                    aria-label="Upload MRI image"
                  >
                    <Upload className="h-10 w-10 text-muted-foreground mb-4" />
                    <span className="font-display font-semibold text-lg mb-1">
                      Drag & drop your MRI scan
                    </span>
                    <span className="text-sm text-muted-foreground mb-4">
                      PNG or JPG, max 10 MB
                    </span>
                    <span className="px-5 py-2 rounded-lg gradient-accent text-primary-foreground text-sm font-medium">
                      Browse Files
                    </span>
                    <input
                      type="file"
                      accept="image/png,image/jpeg"
                      className="hidden"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) handleFile(f);
                      }}
                    />
                  </label>
                </motion.div>
              ) : (
                <motion.div
                  key="preview"
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  className="glass-panel-strong p-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <ImageIcon className="h-4 w-4 text-primary" />
                      <span className="font-medium truncate max-w-[200px]">{file.name}</span>
                      <span className="text-muted-foreground">({(file.size / 1024).toFixed(0)} KB)</span>
                    </div>
                    <button
                      onClick={clearFile}
                      className="p-1.5 rounded-lg hover:bg-muted transition-colors"
                      aria-label="Remove file"
                      disabled={processing}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="relative rounded-xl overflow-hidden bg-foreground/5 mb-6">
                    <img
                      src={preview!}
                      alt="Uploaded MRI scan preview"
                      className="w-full max-h-[400px] object-contain"
                    />
                    {processing && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute inset-0 bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center"
                      >
                        <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
                        <p className="font-display font-semibold">Analyzing scan…</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {apiConnected ? "Running neural network inference" : "Running mock inference"}
                        </p>
                        <div className="mt-6 w-48">
                          <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                            <motion.div
                              initial={{ width: "0%" }}
                              animate={{ width: "100%" }}
                              transition={{ duration: apiConnected ? 5 : 3, ease: "easeInOut" }}
                              className="h-full gradient-accent rounded-full"
                            />
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>

                  <button
                    onClick={handleRunPrediction}
                    disabled={processing}
                    className="w-full py-3 rounded-xl gradient-accent text-primary-foreground font-semibold hover:opacity-90 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {processing ? "Processing…" : "Run Prediction"}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
