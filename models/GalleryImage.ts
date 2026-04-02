import mongoose, { Document, Schema } from "mongoose";

export interface IGalleryImage extends Document {
  id: string;
  imageUrl: string;
  caption: string;
  eventTag: string;
  uploadedAt: string;
}

const GalleryImageSchema: Schema<IGalleryImage> = new Schema({
  id: { type: String, required: true },
  imageUrl: { type: String, required: true },
  caption: { type: String, default: "" },
  eventTag: { type: String, default: "" },
  uploadedAt: { type: String, required: true },
});

const GalleryImageModel =
  mongoose.models.devgallery ||
  mongoose.model<IGalleryImage>("devgallery", GalleryImageSchema);

export default GalleryImageModel;
