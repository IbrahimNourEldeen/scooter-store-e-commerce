import { Schema, model, models } from "mongoose";

const StockSchema = new Schema(
  {
    itemId: { type: Schema.Types.ObjectId, ref: "Item", required: true },
    quantity: { type: Number, required: true, default: 0 },
    minQuantity: { type: Number, default: 1 },
    warehouse: { type: String, default: "Main" },
  },
  { timestamps: true }
);

export default models.Stock || model("Stock", StockSchema);
