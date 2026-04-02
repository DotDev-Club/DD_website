import mongoose, { Document, Schema } from "mongoose";

export type CycleStatus = "active" | "completed" | "upcoming";

export interface ICycle extends Document {
  id: string;
  name: string;
  description: string;
  week: number;
  squad: string[];
  githubRepo: string;
  startDate: string;
  endDate: string;
  industryMentor: string;
  status: CycleStatus;
  outcome: string;
  dateCreated: string;
}

const CycleSchema: Schema<ICycle> = new Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String, default: "" },
  week: { type: Number, default: 1 },
  squad: [{ type: String }],
  githubRepo: { type: String, default: "" },
  startDate: { type: String, required: true },
  endDate: { type: String, default: "" },
  industryMentor: { type: String, default: "" },
  status: {
    type: String,
    enum: ["active", "completed", "upcoming"],
    default: "upcoming",
  },
  outcome: { type: String, default: "" },
  dateCreated: { type: String, required: true },
});

const CycleModel =
  mongoose.models.devcycles ||
  mongoose.model<ICycle>("devcycles", CycleSchema);

export default CycleModel;
