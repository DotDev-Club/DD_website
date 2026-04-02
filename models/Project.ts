import mongoose, { Document, Schema } from "mongoose";

export type ProjectDomain = "Web" | "Mobile" | "AI/ML" | "Blockchain" | "Open Source";

export interface IProject extends Document {
  id: string;
  name: string;
  description: string;
  techStack: string[];
  domain: ProjectDomain;
  coverImage: string;
  liveUrl: string;
  githubUrl: string;
  teamMembers: string[];
  year: string;
  featured: boolean;
}

const ProjectSchema: Schema<IProject> = new Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  techStack: [{ type: String }],
  domain: {
    type: String,
    required: true,
    enum: ["Web", "Mobile", "AI/ML", "Blockchain", "Open Source"],
  },
  coverImage: { type: String, required: true },
  liveUrl: { type: String, default: "" },
  githubUrl: { type: String, default: "" },
  teamMembers: [{ type: String }],
  year: { type: String, required: true },
  featured: { type: Boolean, default: false },
});

const ProjectModel =
  mongoose.models.devprojects ||
  mongoose.model<IProject>("devprojects", ProjectSchema);

export default ProjectModel;
