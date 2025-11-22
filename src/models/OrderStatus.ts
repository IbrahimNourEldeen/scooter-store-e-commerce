import { Schema, model, models } from "mongoose";

const OrderStatusSchema = new Schema(
  {
    name: { type: String, required: true },
  },
  { timestamps: true }
);

export default models.OrderStatus ||
  model("OrderStatus", OrderStatusSchema);
