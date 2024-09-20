import mongoose, { model, Schema, Types } from "mongoose";

const categorySchema = new Schema(
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
    updatedBy: {
      type: Types.ObjectId,
      ref: "User",
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
  }
);

// virtual populate
categorySchema.virtual("subCategories", {
  ref: "SubCategory",
  localField: "_id",
  foreignField: "categoryId",
});

const categoryModel =
  mongoose.models.Category || model("Category", categorySchema);
export default categoryModel;
