import mongoose, { Schema, Document, Model } from "mongoose";

/* ═══════════════════════════════════════════════════════════════════
   Case Model — NGO OS Case Management
   ═══════════════════════════════════════════════════════════════════ */

/* ── Sub-document interfaces ── */
export interface ITimelineEntry {
  date: string;
  event: string;
  type: "report" | "action" | "update";
}

export interface IActionTaken {
  date: string;
  action: string;
  by: string;
}

export interface IFeedbackEntry {
  date: string;
  note: string;
}

/* ── Main Case interface ── */
export interface ICase extends Document {
  caseId: string;
  createdAt: Date;
  updatedAt: Date;
  originalReport: string;
  analysis: Record<string, unknown>;
  timeline: ITimelineEntry[];
  actionsTaken: IActionTaken[];
  feedback: IFeedbackEntry[];
  status: "new" | "in_progress" | "critical" | "improving" | "resolved" | "uncertain";
  category: string;
  summary: string;
}

/* ── Timeline sub-schema ── */
const TimelineEntrySchema = new Schema<ITimelineEntry>(
  {
    date: { type: String, required: true },
    event: { type: String, required: true },
    type: { type: String, enum: ["report", "action", "update"], required: true },
  },
  { _id: false }
);

/* ── Action sub-schema ── */
const ActionTakenSchema = new Schema<IActionTaken>(
  {
    date: { type: String, required: true },
    action: { type: String, required: true },
    by: { type: String, required: true },
  },
  { _id: false }
);

/* ── Feedback sub-schema ── */
const FeedbackEntrySchema = new Schema<IFeedbackEntry>(
  {
    date: { type: String, required: true },
    note: { type: String, required: true },
  },
  { _id: false }
);

/* ── Main Case schema ── */
const CaseSchema = new Schema<ICase>(
  {
    caseId: { type: String, required: true, unique: true, index: true },
    originalReport: { type: String, required: true },
    analysis: { type: Schema.Types.Mixed, required: true },
    timeline: { type: [TimelineEntrySchema], default: [] },
    actionsTaken: { type: [ActionTakenSchema], default: [] },
    feedback: { type: [FeedbackEntrySchema], default: [] },
    status: {
      type: String,
      enum: ["new", "in_progress", "critical", "improving", "resolved", "uncertain"],
      default: "new",
    },
    category: { type: String, default: "other" },
    summary: { type: String, default: "" },
  },
  {
    timestamps: true, // auto createdAt + updatedAt
  }
);

/* ── Export model (reuse if already compiled — Next.js hot reload safe) ── */
const CaseModel: Model<ICase> =
  mongoose.models.Case || mongoose.model<ICase>("Case", CaseSchema);

export default CaseModel;
