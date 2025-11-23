import { Schema, model, models } from "mongoose";

const StockTransactionSchema = new Schema(
  {
    itemId: { type: Schema.Types.ObjectId, ref: "Item", required: true },
    quantity: { type: Number, required: true }, // لو سالب يبقى بيع، موجب يبقى إضافة
    movementType: {
      type: String,
      enum: ["IN", "OUT", "SALE", "RETURN"],
      required: true,
    },
    reference: { type: String }, // رقم الفاتورة أو السبب
    userId: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export default models.StockTransaction ||
  model("StockTransaction", StockTransactionSchema);
