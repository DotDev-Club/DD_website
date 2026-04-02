import mongoose, { Document, Schema } from "mongoose";

export type ApplicationStatus = "pending" | "reviewed" | "accepted" | "rejected";

export interface IApplication extends Document {
  name: string;
  email: string;
  year: string;
  branch: string;
  whyJoin: string;
  skills: string;
  submittedAt: string;
  status: ApplicationStatus;
}

const ApplicationSchema: Schema<IApplication> = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  year: { type: String, required: true },
  branch: { type: String, required: true },
  whyJoin: { type: String, required: true },
  skills: { type: String, required: true },
  submittedAt: { type: String, required: true },
  status: {
    type: String,
    enum: ["pending", "reviewed", "accepted", "rejected"],
    default: "pending",
  },
});

const ApplicationModel =
  mongoose.models.devapplications ||
  mongoose.model<IApplication>("devapplications", ApplicationSchema);

export default ApplicationModel;
