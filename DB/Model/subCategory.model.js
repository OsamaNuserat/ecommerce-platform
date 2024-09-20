import mongoose, { model, Schema, Types } from "mongoose";

const subCategorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    slug: {
      type: String,
      required: true,
    },
    image: {
      type: Object,
      required: true,
    },
    createdBy: {
      type: Types.ObjectId,
      ref: "User",
    },
    categoryId: {
      type: Types.ObjectId,
      ref: "Category",
    },
  },
  {
    timestamps: true,
  }
);

subCategorySchema.virtual("products", {
  ref: "Product",
  localField: "_id",
  foreignField: "subCategoryId",
});


const subCategoryModel =
  mongoose.models.SubCategory || model("SubCategory", subCategorySchema);
export default subCategoryModel;
