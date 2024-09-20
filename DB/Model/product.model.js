import mongoose, { model, Schema, Types } from "mongoose";

const productSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  stock: {
    type: Number,
    required: true,
    default: 0,
  },
  price: {
    type: Number,
    required: true,
    default: 1,
  },
  discount: {
    type: Number,
    default: 0,
  },
  finalPrice: {
    type: Number,
    default: 1,
  },
  colors: [String],
  sizes: [
    {
      type: String,
      enum: ["S", "M", "L", "XL", "XXL"],
    },
  ],
  mainImage: {
    type: Object,
    required: true,
  },
  subImages: [Object],
  categoryId: {
    type: Types.ObjectId,
    ref: "Category",
    required: true,
  },
  subCategoryId: {
    type: Types.ObjectId,
    ref: "SubCategory",
    required: true,
  },
  brandId: {
    type: Types.ObjectId,
    ref: "Brand",
    required: true,
  },
  createdBy: {
    type: Types.ObjectId,
    ref: "User",
  },
  updatedBy: {
    type: Types.ObjectId,
    ref: "User",
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
});

productSchema.virtual("reviews", {
  ref: "Review",
  localField: "_id",
  foreignField: "productId",
});

const productModel = mongoose.models.Product || model("Product", productSchema);
export default productModel;
