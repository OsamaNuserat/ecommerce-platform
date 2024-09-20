import mongoose, { model, Schema, Types } from "mongoose";

const couponSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    amount: {
      type: Number,
      required: true,
      default: 1,
    },
    expireDate: {
      type: Date,
      required: true,
    },
    usedBy: [
      {
        type: Types.ObjectId,
        ref: "User",
      },
    ],
    createdBy: {
      type: Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const couponModel = mongoose.models.Coupon || model("Coupon", couponSchema);
export default couponModel;
