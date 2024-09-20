import slugify from "slugify";
import categoryModel from "../../../../DB/Model/category.model.js";
import Cloudinary from "../../../Services/Cloudinary.js";

export const createCategory = async (req, res, next) => {
  const name = req.body.name.toLowerCase();

  const { secure_url, public_id } = await Cloudinary.uploader.upload(
    req.file.path,
    {
      folder: "Category",
    }
  );
  const category = await categoryModel.create({
    name,
    slug: slugify(name),
    image: { url: secure_url, public_id },
    createdBy: req.user._id,
  });
  return res.status(201).json({ message: "success", category });
};

export const updateCategory = async (req, res, next) => {
  const { id } = req.params;
  const { name } = req.body;

  const category = await categoryModel.findById(id);
  if (!category) {
    return next(new Error("Category not found", { cause: 409 }));
  }

  if (req.file) {
    const { secure_url, public_id } = await Cloudinary.uploader.upload(
      req.file.path,
      { folder: "Category" }
    );

    await Cloudinary.uploader.destroy(category.image.public_id);

    category.image = { url: secure_url, public_id };
  }

  if (name) {
    if (category.name == name) {
      return next(
        new Error("Category name is same as previous", { cause: 409 })
      );
    }
    if (await categoryModel.findOne({ name })) {
      return next(new Error("Category name already exists", { cause: 409 }));
    }
    category.name = name;
    category.slug = slugify(name);
  }
  category.updatedBy = req.user._id;
  await category.save();
  return res.status(200).json({ message: "success", category });
};

export const getCategory = async (req, res, next) => {
  const { categoryId } = req.params;

  const category = await categoryModel.findById(categoryId);
  return res.json({ message: "success", category });
};

export const getAllCategories = async (req, res, next) => {
  const categories = await categoryModel.find().populate({
    path: "subCategories",
    select: "name image",
  });
  return res.json({ message: "success", categories });
};
