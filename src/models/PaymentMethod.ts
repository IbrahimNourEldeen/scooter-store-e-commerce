import { Schema, model, models } from "mongoose";

const PaymentMethodSchema = new Schema(
  {
    name: { type: String, required: true },
    type: { type: String, enum: ["cash", "visa", "online"], required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default models.PaymentMethod ||
  model("PaymentMethod", PaymentMethodSchema);
