import mongoose, { Schema, model, models } from "mongoose";

const orderItemSchema = new Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  price: {
    type: Number,
    required: true
  },
  total: {
    type: Number,
    required: true
  }
});

const orderSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    items: {
      type: [orderItemSchema],
      required: true,
    },

    subtotal: {
      type: Number,
      required: true,
    },

    discount: {
      type: Number,
      default: 0,
    },

    tax: {
      type: Number,
      default: 0,
    },

    total: {
      type: Number,
      required: true,
    },

    paymentType: {
      type: String,
      enum: ["cash", "card", "online"],
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "completed", "cancelled"],
      default: "pending",
    },

    notes: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const Order = models.Order || model("Order", orderSchema);
export default Order;
