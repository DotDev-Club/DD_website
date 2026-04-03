import mongoose, { Document, Schema } from "mongoose";

export interface IAdminUser extends Document {
  email: string;
  addedAt: string;
}

const AdminUserSchema: Schema<IAdminUser> = new Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  addedAt: { type: String, required: true },
});

const AdminUserModel =
  mongoose.models.devadmins ||
  mongoose.model<IAdminUser>("devadmins", AdminUserSchema);

export default AdminUserModel;
