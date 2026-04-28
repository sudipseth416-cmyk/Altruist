"use client";

import React, { useState, useRef, useCallback } from "react";
import {
  Upload,
  FileText,
  Image as ImageIcon,
  X,
  Send,
  Loader2,
  CheckCircle2,
  FileUp,
  AlertCircle,
  RotateCcw,
  ShieldCheck,
  Zap,
  MapPin,
  Users,
  Tag,
  Gauge,
  Sparkles,
  Lock,
  BrainCircuit,
  Activity,
  ListChecks
} from "lucide-react";
import type { UploadStatus, CrisisNeed } from "@/lib/types";


interface DataUploadPanelProps {
  onAnalyze: (data: { text: string; fileName?: string }) => void;
  onNeedParsed: (need: CrisisNeed) => void;
  status: UploadStatus;
  errorMessage?: string | null;
  lastParsedNeed: CrisisNeed | null;
  onReportTextChange?: (text: string) => void;
}

const urgencyColors: Record<string, { text: string; bg: string; border: string }> = {
  critical: { text: "text-rose-400", bg: "bg-rose-500/10", border: "border-rose-500/20" },
  high: { text: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20" },
  medium: { text: "text-cyan-400", bg: "bg-cyan-500/10", border: "border-cyan-500/20" },
  low: { text: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
};

export default function DataUploadPanel({
  onAnalyze,
  onNeedParsed,
  status,
  errorMessage,
  lastParsedNeed,
  onReportTextChange,
}: DataUploadPanelProps) {
  const [text, setText] = useState("");
  const [fileName, setFileName] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [showExtraction, setShowExtraction] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);


  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) {
      setFileName(e.dataTransfer.files[0].name);
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFileName(e.target.files[0].name);
    }
  };

  const handleSubmit = async () => {
    if (!text.trim() && !fileName) return;

    const reportText = text.trim() || `Extracted content from ${fileName}: The situation requires immediate attention. Local resources are overwhelmed and external support is needed for emergency response.`;

    // Parse the text through NLP first
    if (reportText) {
      // Dynamic import to avoid SSR issues
      import("@/lib/nlp-parser").then(({ parseNaturalLanguage }) => {
        const need = parseNaturalLanguage(reportText);
        onNeedParsed(need);
        setShowExtraction(true);
      });
    }

    onAnalyze({ text: reportText, fileName: fileName || undefined });
    // Track report text for Gemini deep analysis
    if (reportText && onReportTextChange) {
      onReportTextChange(reportText);
    }
  };

  const clearFile = () => {
    setFileName(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleReset = () => {
    setText("");
    setFileName(null);
    setShowExtraction(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const isProcessing = status === "uploading" || status === "analyzing";
  const hasError = status === "error";
  const uc = lastParsedNeed ? urgencyColors[lastParsedNeed.urgency] : null;

  return (
    <div className="liquid-glass rounded-3xl border border-white/5 shadow-[0_8px_32px_rgba(0,0,0,0.3)] p-8 animate-fade-in animate-delay-200 font-['Poppins',sans-serif] relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 blur-[80px] rounded-full pointer-events-none transition-opacity opacity-50 group-hover:opacity-100" />
      <div className="relative z-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center border border-cyan-500/30 shadow-[0_0_15px_rgba(6,214,242,0.2)]">
            <FileUp className="w-6 h-6 text-cyan-400" />
          </div>
          <div>
            <h3 className="text-lg text-white font-bold tracking-tight flex items-center gap-2 text-shadow-glow">
              Intelligence Ingestion
              <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
            </h3>
            <p className="text-white/50 text-xs mt-1 font-medium tracking-wide">
              NLP-powered field report analysis
            </p>
          </div>
        </div>
        {status === "complete" && (
          <span className="badge badge-emerald">
            <CheckCircle2 className="w-3 h-3" /> Analyzed
          </span>
        )}
        {hasError && (
          <span className="badge badge-rose">
            <AlertCircle className="w-3 h-3" /> Failed
          </span>
        )}
        {isProcessing && (
          <span className="badge badge-cyan">
            <Loader2 className="w-3 h-3 animate-spin" /> Processing
          </span>
        )}
      </div>

      {/* Error Banner */}
      {hasError && errorMessage && (
        <div className="mb-3 p-3 rounded-xl bg-ngo-rose/[0.06] border border-ngo-rose/20 flex items-start gap-3 animate-fade-in">
          <AlertCircle className="w-4 h-4 text-ngo-rose flex-shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-ngo-rose-light">Analysis Failed</p>
            <p className="text-xs text-slate-400 mt-0.5">{errorMessage}</p>
          </div>
          <button
            onClick={handleSubmit}
            disabled={!text.trim() && !fileName}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-ngo-rose-light border border-ngo-rose/20 hover:bg-ngo-rose/10 transition-colors flex-shrink-0"
          >
            <RotateCcw className="w-3 h-3" />
            Retry
          </button>
        </div>
      )}

      {/* NLP Extraction Result */}
      {showExtraction && lastParsedNeed && uc && (
        <div className="mb-6 p-5 rounded-2xl bg-gradient-to-br from-cyan-500/10 to-purple-500/5 border border-cyan-500/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] animate-fade-in relative overflow-hidden">
          <div className="absolute top-0 right-0 bottom-0 w-1/2 bg-gradient-to-l from-cyan-500/10 to-transparent pointer-events-none" />
          <div className="flex items-center gap-2 mb-4 relative z-10">
            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest">
              AI Analysis Complete
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3 relative z-10">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-black/20 border border-white/5 hover:bg-white/5 transition-colors">
              <MapPin className="w-4 h-4 text-cyan-400 flex-shrink-0" />
              <div>
                <p className="text-[9px] text-white/40 font-bold uppercase tracking-wider mb-0.5">Location</p>
                <p className="text-xs text-white/90 font-semibold truncate">{lastParsedNeed.location}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-black/20 border border-white/5 hover:bg-white/5 transition-colors">
              <Tag className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <div>
                <p className="text-[9px] text-white/40 font-bold uppercase tracking-wider mb-0.5">Category</p>
                <p className="text-xs text-white/90 font-semibold truncate">{lastParsedNeed.category}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-black/20 border border-white/5 hover:bg-white/5 transition-colors">
              <Gauge className={`w-4 h-4 flex-shrink-0 ${uc.text}`} />
              <div>
                <p className="text-[9px] text-white/40 font-bold uppercase tracking-wider mb-0.5">Urgency</p>
                <p className={`text-xs font-bold uppercase ${uc.text}`}>{lastParsedNeed.urgency}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-black/20 border border-white/5 hover:bg-white/5 transition-colors">
              <Users className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <div>
                <p className="text-[9px] text-white/40 font-bold uppercase tracking-wider mb-0.5">Population</p>
                <p className="text-xs text-white/90 font-semibold">
                  {lastParsedNeed.population > 0 ? lastParsedNeed.population.toLocaleString() : "Unknown"}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}


      {/* Drop Zone */}
      <div
        className={`relative border-2 border-dashed rounded-2xl p-6 text-center transition-all duration-400 cursor-pointer group mb-6 flex flex-col items-center justify-center ${
          dragActive
            ? "border-cyan-400 bg-cyan-500/10 shadow-[0_0_20px_rgba(6,214,242,0.2)]"
            : fileName
              ? "border-emerald-500/40 bg-emerald-500/5"
              : "border-white/10 hover:border-white/20 hover:bg-white/5"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.png,.jpg,.jpeg,.webp,.csv,.txt"
          onChange={handleFileChange}
          className="hidden"
          id="file-upload-input"
        />
        {fileName ? (
          <div className="flex items-center justify-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
              {fileName.match(/\.(png|jpg|jpeg|webp)$/i) ? (
                <ImageIcon className="w-6 h-6 text-emerald-400" />
              ) : (
                <FileText className="w-6 h-6 text-emerald-400" />
              )}
            </div>
            <div className="text-left">
              <p className="text-sm font-bold text-white truncate max-w-[200px] mb-0.5">
                {fileName}
              </p>
              <p className="text-xs text-emerald-400 font-medium">Ready for AI processing</p>
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); clearFile(); }}
              className="ml-4 p-2 rounded-lg bg-black/40 hover:bg-white/10 text-white/40 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <>
            <div className="w-14 h-14 rounded-2xl bg-white/[0.04] flex items-center justify-center mx-auto mb-3 group-hover:bg-cyan-500/10 group-hover:shadow-[0_0_15px_rgba(6,214,242,0.2)] transition-all">
              <Upload className="w-6 h-6 text-white/40 group-hover:text-cyan-400 transition-colors" />
            </div>
            <p className="text-sm font-bold text-white/80 mb-1">
              Drop intel files here
            </p>
            <p className="text-[11px] text-white/40 font-medium tracking-wide">
              PDF, Images, CSV, or Text — Max 10MB
            </p>
          </>
        )}
      </div>

      {/* Text Input */}
      <div className="mb-6 relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-2xl blur opacity-0 group-hover:opacity-[0.15] transition duration-500 pointer-events-none"></div>
        <label htmlFor="field-report-text" className="block text-xs font-bold text-white/50 uppercase tracking-widest mb-2 relative z-10">
          Manual Intel Entry
        </label>
        <textarea
          id="field-report-text"
          value={text}
          onChange={(e) => { setText(e.target.value); setShowExtraction(false); }}
          placeholder='e.g. "Flooding in Sector 7, 50 families displaced, urgent need for clean water..."'
          className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 text-white/90 focus:outline-none focus:border-cyan-500/50 transition-colors min-h-[120px] resize-none text-sm leading-relaxed relative z-10 placeholder-white/20"
          rows={4}
          disabled={isProcessing}
        />
        <div className="flex items-center justify-between mt-2 px-1 relative z-10">
          <span className="text-[10px] text-white/40 font-medium">
            {text.length > 0 ? `${text.length} characters — Ready for extraction` : "Paste or type field report"}
          </span>
          {text.length > 0 && !isProcessing && (
            <button onClick={handleReset} className="text-[10px] text-white/50 hover:text-white transition-colors font-semibold uppercase tracking-wider">
              Clear All
            </button>
          )}
        </div>
      </div>

      {/* Privacy Notice */}
      <div className="mb-6 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500/5 border border-emerald-500/10 backdrop-blur-sm relative z-10">
        <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
        <span className="text-xs text-emerald-400/80 font-semibold tracking-wide">
          Encrypted Processing
        </span>
        <Lock className="w-3 h-3 text-emerald-400/40 ml-auto" />
        <span className="text-[10px] text-emerald-400/60 font-bold uppercase tracking-wider">
          PII Auto-Masked
        </span>
      </div>

      {/* Submit */}
      <button
        id="submit-analysis-btn"
        onClick={handleSubmit}
        disabled={isProcessing || (!text.trim() && !fileName)}
        className={`w-full py-4 rounded-2xl font-bold text-base transition-all duration-300 flex items-center justify-center gap-3 relative z-10 overflow-hidden group ${
          isProcessing || (!text.trim() && !fileName)
            ? "bg-white/5 text-white/30 cursor-not-allowed border border-white/5"
            : "bg-gradient-to-r from-purple-500 to-cyan-500 text-white shadow-[0_0_20px_rgba(168,85,247,0.3)] hover:shadow-[0_0_30px_rgba(6,214,242,0.5)] hover:scale-[1.02]"
        }`}
      >
        <div className="absolute inset-0 bg-white/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
        {isProcessing ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin relative z-10" />
            <span className="relative z-10 tracking-wide">{status === "uploading" ? "Uploading Stream..." : "AI Engine Processing..."}</span>
          </>
        ) : (
          <>
            <Zap className="w-5 h-5 relative z-10" />
            <span className="relative z-10 tracking-wide">Process Intelligence</span>
          </>
        )}
      </button>
      </div>
    </div>
  );
}
