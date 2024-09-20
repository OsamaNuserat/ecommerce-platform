import slugify from "slugify";
import subCategoryModel from "../../../../DB/Model/subCategory.model.js";
import Cloudinary from "../../../Services/Cloudinary.js";

export const createSubCategory = async (req, res, next) => {
  const { categoryId } = req.params;
  const { name } = req.body;

  const { secure_url, public_id } = await Cloudinary.uploader.upload(
    req.file.path,
    {
      folder: "subCategory",
    }
  );
  const subCategory = await subCategoryModel.create({
    name,
    categoryId,
    slug: slugify(name),
    image: { url: secure_url, public_id },
  });
  return res.status(201).json({ message: "success", subCategory });
};

export const updateSubCategory = async (req, res, next) => {
  const { subCategoryId, categoryId } = req.params;
  const { name } = req.body;

  const subCategory = await subCategoryModel.findOne({
    _id: subCategoryId,
    categoryId,
  });
  if (!subCategory) {
    return next(new Error("Sub Category not found", { cause: 409 }));
  }

  if (req.file) {
    const { secure_url, public_id } = await Cloudinary.uploader.upload(
      req.file.path,
      { folder: "SubCategory" }
    );

    await Cloudinary.uploader.destroy(subCategory.image.public_id);

    subCategory.image = { secure_url, public_id };
  }
  if (req.body.name) {
    if (subCategory.name == req.body.name) {
      return next(
        new Error("Sub Category name is same as previous", { cause: 409 })
      );
    }
    if (await subCategoryModel.findOne({ name })) {
      return next(
        new Error("Sub Category name already exists", { cause: 409 })
      );
    }
    subCategory.name = req.body.name;
    subCategory.slug = slugify(req.body.name);
  }
  await subCategory.save();
  return res.json({ message: "success", subCategory });
};

// get all subcategories depending on a specific category
export const getSubCategory = async (req, res, next) => {
  const { categoryId } = req.params;
  const subCategories = await subCategoryModel.find({ categoryId });
  return res.json({ message: "success", subCategories });
};
export const getAllSubCategories = async (req, res, next) => {
  const subCategories = await subCategoryModel.find({});
  return res.json({ message: "success", subCategories });
};
export const getProducts = async (req, res, next) => {
  const { subCategoryId } = req.params;
  const Products = await subCategoryModel.findById(subCategoryId).populate({
    path: "products",
    match: { isDeleted: { $eq: false } },
    populate: { path: "reviews" },
  });
  return res.json({ message: "success", Products });
};
