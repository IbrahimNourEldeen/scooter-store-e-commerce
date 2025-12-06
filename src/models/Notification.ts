import { Schema, model, models } from "mongoose";

const NotificationSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },

    title: { type: String, required: true },
    body: { type: String, required: true },

    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default models.Notification || model("Notification", NotificationSchema);
