import mongoose, { Schema, Types } from "mongoose";

const reviewSchema = new Schema(
  {
    comment: { type: String, required: true },
    rating: { type: Number, required: true },
    productId: {
      type: Types.ObjectId,
      ref: "Product",
      required: true,
    },
    orderId: {
      type: Types.ObjectId,
      ref: "Order",
      required: true,
    },
    createdBy: {
      type: Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const reviewModel =
  mongoose.models.Review || mongoose.model("Review", reviewSchema);
export default reviewModel;
