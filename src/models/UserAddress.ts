import { Schema, model, models } from "mongoose";

const UserAddressSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    city: { type: String, required: true },
    area: { type: String },
    street: { type: String },
    building: { type: String },
    floor: { type: String },
    landmark: { type: String },
    isDefault: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default models.UserAddress ||
  model("UserAddress", UserAddressSchema);
