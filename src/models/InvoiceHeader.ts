import { Schema, model, models } from "mongoose";

const InvoiceHeaderSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    paymentMethodId: {
      type: Schema.Types.ObjectId,
      ref: "PaymentMethod",
      required: true,
    },
    addressId: { type: Schema.Types.ObjectId, ref: "UserAddress" },
    statusId: { type: Schema.Types.ObjectId, ref: "OrderStatus" },

    total: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    finalTotal: { type: Number, required: true },
  },
  { timestamps: true }
);

export default models.InvoiceHeader ||
  model("InvoiceHeader", InvoiceHeaderSchema);
