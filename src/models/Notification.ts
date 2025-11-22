import { Schema, model, models } from "mongoose";

const NotificationSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: { type: String, enum: ["order", "stock", "system"], default: "system" },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default models.Notification ||
  model("Notification", NotificationSchema);
