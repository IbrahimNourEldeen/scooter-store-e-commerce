import { Schema, model, models } from "mongoose";

const UserSchema = new Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, 
    phone: { type: String },
    role: {
      type: String,
      enum: ["admin", "customer", "warehouse"],
      default: "customer",
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default models.User || model("User", UserSchema);
