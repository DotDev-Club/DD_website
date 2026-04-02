import mongoose, { Document, Schema } from "mongoose";

export type EventType = "Hackathon" | "Workshop" | "Talk" | "Product Sprint";
export type EventStatus = "upcoming" | "ongoing" | "past";

export interface IEvent extends Document {
  id: string;
  title: string;
  description: string;
  date: string;
  type: EventType;
  bannerImage: string;
  registrationLink: string;
  status: EventStatus;
  venue: string;
  dateCreated: string;
  dateModified: string;
}

const EventSchema: Schema<IEvent> = new Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: String, required: true },
  type: {
    type: String,
    required: true,
    enum: ["Hackathon", "Workshop", "Talk", "Product Sprint"],
  },
  bannerImage: { type: String, required: true },
  registrationLink: { type: String, default: "" },
  status: {
    type: String,
    required: true,
    enum: ["upcoming", "ongoing", "past"],
    default: "upcoming",
  },
  venue: { type: String, default: "" },
  dateCreated: { type: String, required: true },
  dateModified: { type: String, required: true },
});

const EventModel =
  mongoose.models.devevents ||
  mongoose.model<IEvent>("devevents", EventSchema);

export default EventModel;
