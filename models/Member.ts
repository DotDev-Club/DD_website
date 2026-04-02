import mongoose, { Document, Schema } from "mongoose";

export type MemberCategory = "Core Team" | "Faculty Advisor" | "Mentor";

export interface IMember extends Document {
  id: string;
  name: string;
  role: string;
  category: MemberCategory;
  photo: string;
  linkedin: string;
  github: string;
  batch: string;
  bio: string;
}

const MemberSchema: Schema<IMember> = new Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String, required: true },
  category: {
    type: String,
    required: true,
    enum: ["Core Team", "Faculty Advisor", "Mentor"],
    default: "Core Team",
  },
  photo: { type: String, required: true },
  linkedin: { type: String, default: "" },
  github: { type: String, default: "" },
  batch: { type: String, required: true },
  bio: { type: String, default: "" },
});

const MemberModel =
  mongoose.models.devmembers ||
  mongoose.model<IMember>("devmembers", MemberSchema);

export default MemberModel;
