import { Schema, model, models } from "mongoose";

const ItemTypeSchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String },
    image: { type: String }, 
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const ItemType = models.ItemType || model("ItemType", ItemTypeSchema);
export default ItemType;
