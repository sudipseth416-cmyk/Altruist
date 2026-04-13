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
} from "lucide-react";
import type { UploadStatus, CrisisNeed } from "@/lib/types";

interface DataUploadPanelProps {
  onAnalyze: (data: { text: string; fileName?: string }) => void;
  onNeedParsed: (need: CrisisNeed) => void;
  status: UploadStatus;
  errorMessage?: string | null;
  lastParsedNeed: CrisisNeed | null;
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

  const handleSubmit = () => {
    if (!text.trim() && !fileName) return;

    // Parse the text through NLP first
    if (text.trim()) {
      // Dynamic import to avoid SSR issues
      import("@/lib/nlp-parser").then(({ parseNaturalLanguage }) => {
        const need = parseNaturalLanguage(text.trim());
        onNeedParsed(need);
        setShowExtraction(true);
      });
    }

    onAnalyze({ text: text.trim(), fileName: fileName || undefined });
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
    <div className="glass-card p-5 animate-fade-in animate-delay-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="icon-box icon-box-cyan">
            <FileUp className="w-5 h-5 text-ngo-cyan" />
          </div>
          <div>
            <h3 className="text-white font-semibold text-sm flex items-center gap-2">
              Intelligence Ingestion
              <Sparkles className="w-3.5 h-3.5 text-ngo-accent/60 animate-breathe" />
            </h3>
            <p className="text-slate-500 text-xs mt-0.5">
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
        <div className="mb-4 p-3.5 rounded-xl bg-gradient-to-br from-ngo-accent/[0.06] to-cyan-500/[0.03] border border-ngo-accent/15 animate-fade-in">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-3.5 h-3.5 text-ngo-accent" />
            <span className="text-[10px] font-bold text-ngo-accent uppercase tracking-wider">
              NLP Extraction Complete
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center gap-2 p-2 rounded-lg bg-white/[0.03] border border-white/[0.04]">
              <MapPin className="w-3.5 h-3.5 text-ngo-cyan flex-shrink-0" />
              <div>
                <p className="text-[9px] text-slate-500 font-medium uppercase tracking-wider">Location</p>
                <p className="text-xs text-white font-semibold">{lastParsedNeed.location}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-lg bg-white/[0.03] border border-white/[0.04]">
              <Tag className="w-3.5 h-3.5 text-ngo-amber flex-shrink-0" />
              <div>
                <p className="text-[9px] text-slate-500 font-medium uppercase tracking-wider">Category</p>
                <p className="text-xs text-white font-semibold">{lastParsedNeed.category}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-lg bg-white/[0.03] border border-white/[0.04]">
              <Gauge className={`w-3.5 h-3.5 flex-shrink-0 ${uc.text}`} />
              <div>
                <p className="text-[9px] text-slate-500 font-medium uppercase tracking-wider">Urgency</p>
                <p className={`text-xs font-bold uppercase ${uc.text}`}>{lastParsedNeed.urgency}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-lg bg-white/[0.03] border border-white/[0.04]">
              <Users className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
              <div>
                <p className="text-[9px] text-slate-500 font-medium uppercase tracking-wider">Population</p>
                <p className="text-xs text-white font-semibold">
                  {lastParsedNeed.population > 0
                    ? lastParsedNeed.population.toLocaleString()
                    : "Unknown"}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Drop Zone */}
      <div
        className={`relative border-2 border-dashed rounded-xl p-5 text-center transition-all duration-300 cursor-pointer group mb-3 ${
          dragActive
            ? "border-ngo-cyan bg-ngo-cyan/5"
            : fileName
            ? "border-ngo-accent/30 bg-ngo-accent/5"
            : "border-white/10 hover:border-white/20 hover:bg-white/[0.02]"
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
          <div className="flex items-center justify-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-ngo-accent/10 flex items-center justify-center">
              {fileName.match(/\.(png|jpg|jpeg|webp)$/i) ? (
                <ImageIcon className="w-5 h-5 text-ngo-accent" />
              ) : (
                <FileText className="w-5 h-5 text-ngo-accent" />
              )}
            </div>
            <div className="text-left">
              <p className="text-sm font-medium text-white truncate max-w-[200px]">
                {fileName}
              </p>
              <p className="text-xs text-slate-500 mt-0.5">Ready for analysis</p>
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); clearFile(); }}
              className="ml-2 p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <>
            <div className="w-10 h-10 rounded-xl bg-white/[0.04] flex items-center justify-center mx-auto mb-2 group-hover:bg-white/[0.06] transition-colors">
              <Upload className="w-5 h-5 text-slate-400 group-hover:text-slate-300 transition-colors" />
            </div>
            <p className="text-xs font-medium text-slate-300 mb-0.5">
              Drop files here or click to browse
            </p>
            <p className="text-[10px] text-slate-500">
              PDF, Images, CSV, or Text — Max 10MB
            </p>
          </>
        )}
      </div>

      {/* Text Input */}
      <div className="mb-3">
        <label
          htmlFor="field-report-text"
          className="block text-xs font-medium text-slate-400 mb-1.5"
        >
          Field Report / Crisis Description
        </label>
        <textarea
          id="field-report-text"
          value={text}
          onChange={(e) => { setText(e.target.value); setShowExtraction(false); }}
          placeholder='e.g. "Flooding in Sector 7, 50 families displaced, urgent need for clean water and emergency medical supplies..."'
          className="input-field min-h-[100px] resize-none leading-relaxed text-sm"
          rows={4}
          disabled={isProcessing}
        />
        <div className="flex items-center justify-between mt-1">
          <span className="text-[10px] text-slate-600">
            {text.length > 0
              ? `${text.length} characters — NLP will auto-extract structured data`
              : "Paste or type your field report"}
          </span>
          {text.length > 0 && !isProcessing && (
            <button
              onClick={handleReset}
              className="text-[10px] text-slate-500 hover:text-slate-300 transition-colors"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Privacy Notice */}
      <div className="mb-3 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/[0.05] border border-emerald-500/10">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400/80 flex-shrink-0" />
        <span className="text-[10px] text-emerald-300/70 font-medium">
          Privacy Protected Processing
        </span>
        <Lock className="w-2.5 h-2.5 text-emerald-400/50 ml-auto" />
        <span className="text-[9px] text-emerald-400/50 font-medium">
          PII Auto-Masked
        </span>
      </div>

      {/* Submit */}
      <button
        id="submit-analysis-btn"
        onClick={handleSubmit}
        disabled={isProcessing || (!text.trim() && !fileName)}
        className={`btn-primary w-full flex items-center justify-center gap-2 ${
          isProcessing || (!text.trim() && !fileName)
            ? "opacity-50 cursor-not-allowed"
            : ""
        }`}
      >
        {isProcessing ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            {status === "uploading" ? "Uploading..." : "AI Analysis in Progress..."}
          </>
        ) : (
          <>
            <Zap className="w-4 h-4" />
            Analyze & Match Resources
          </>
        )}
      </button>
    </div>
  );
}
