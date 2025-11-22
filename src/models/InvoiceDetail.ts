import { Schema, model, models } from "mongoose";

const InvoiceDetailsSchema = new Schema(
  {
    invoiceId: {
      type: Schema.Types.ObjectId,
      ref: "InvoiceHeader",
      required: true,
    },
    itemId: { type: Schema.Types.ObjectId, ref: "Item", required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    total: { type: Number, required: true },
  },
  { timestamps: true }
);

export default models.InvoiceDetails ||
  model("InvoiceDetails", InvoiceDetailsSchema);
