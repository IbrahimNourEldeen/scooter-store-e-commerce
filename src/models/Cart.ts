import { Schema, model, models } from "mongoose";

const CartSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    items: [
      {
        itemId: { type: Schema.Types.ObjectId, ref: "Item" },
        quantity: { type: Number, default: 1 },
      },
    ],
  },
  { timestamps: true }
);

export default models.Cart || model("Cart", CartSchema);
