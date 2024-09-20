import mongoose, { Schema, Types } from "mongoose";
import { model } from "mongoose";

const cartSchema = new Schema({
  userId: {
    type: Types.ObjectId,
    required: true,
    ref: "User",
  },
  products: [
    {
      productId: {
        type: Types.ObjectId,
        required: true,
        ref: "Product",
      },
      quantity: {
        type: Number,
        required: true,
        default: 1,
      },
    },
  ],
});

const cartModel = mongoose.models.Cart || model("Cart", cartSchema);
export default cartModel;
