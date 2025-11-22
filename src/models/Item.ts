import { Schema, model, models } from "mongoose";
import "@/models/ItemType";
import "@/models/Brand";

const ItemSchema = new Schema(
  {
    name: { type: String, required: true },
    typeId: { type: Schema.Types.ObjectId, ref: "ItemType", required: true },
    brandId: { type: Schema.Types.ObjectId, ref: "Brand", required: true },
    description: { type: String },
    price: { type: Number, required: true },
    images: [{ type: String }],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default models.Item || model("Item", ItemSchema);
