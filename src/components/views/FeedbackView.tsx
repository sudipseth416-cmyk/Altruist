"use client";

import React from "react";
import FeedbackPanel from "@/components/FeedbackPanel";

export default function FeedbackView() {
  return (
    <div className="view-container animate-fade-in h-full flex flex-col">
      <div className="mb-5">
        <h2 className="text-xl font-bold text-white tracking-tight">Field Feedback</h2>
        <p className="text-sm text-slate-400">Review feedback and reports from field operators</p>
      </div>
      <div className="flex-1">
        <FeedbackPanel />
      </div>
    </div>
  );
}
