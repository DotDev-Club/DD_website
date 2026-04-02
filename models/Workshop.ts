import mongoose, { Document, Schema } from "mongoose";

export interface IWorkshop extends Document {
  id: string;
  title: string;
  facilitator: string;
  date: string;
  duration: string;
  description: string;
  resourcesLink: string;
  coverImage: string;
  tags: string[];
  dateCreated: string;
}

const WorkshopSchema: Schema<IWorkshop> = new Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
  facilitator: { type: String, required: true },
  date: { type: String, required: true },
  duration: { type: String, required: true },
  description: { type: String, required: true },
  resourcesLink: { type: String, default: "" },
  coverImage: { type: String, required: true },
  tags: [{ type: String }],
  dateCreated: { type: String, required: true },
});

const WorkshopModel =
  mongoose.models.devworkshops ||
  mongoose.model<IWorkshop>("devworkshops", WorkshopSchema);

export default WorkshopModel;
