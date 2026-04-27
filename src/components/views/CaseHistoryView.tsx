"use client";

import React from "react";
import CaseHistoryPanel from "@/components/CaseHistoryPanel";

export default function CaseHistoryView() {
  return (
    <div className="view-container animate-fade-in h-full flex flex-col">
      <div className="mb-5">
        <h2 className="text-xl font-bold text-white tracking-tight">Case History & Management</h2>
        <p className="text-sm text-slate-400">View and manage all operations history</p>
      </div>
      <div className="flex-1">
        <CaseHistoryPanel />
      </div>
    </div>
  );
}
