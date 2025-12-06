import { Schema, model, models } from "mongoose";

const CouponSchema = new Schema(
  {
    code: { type: String, required: true, unique: true },

    discountType: { type: String, enum: ["percent", "fixed"], required: true },
    amount: { type: Number, required: true },

    minOrder: { type: Number, default: 0 },
    maxDiscount: { type: Number },

    expiresAt: { type: Date, required: true },

    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default models.Coupon || model("Coupon", CouponSchema);
