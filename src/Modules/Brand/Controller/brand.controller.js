import brandModel from "../../../../DB/Model/brand.model.js";
import Cloudinary from "../../../Services/Cloudinary.js";

export const createBrand = async (req, res, next) => {
  const { name, categoryId } = req.body;

  if (await brandModel.findOne({ name })) {
    return next(new Error("Brand name already exists", { cause: 409 }));
  }
  const { secure_url, public_id } = await Cloudinary.uploader.upload(
    req.file.path,
    {
      folder: "brands",
    }
  );
  const brand = await brandModel.create({
    name,
    image: { secure_url, public_id },
    categoryId,
  });
  return res.json({ message: "success", brand });
};
export const getAllBrands = async (req, res, next) => {
  const { categoryId } = req.params;
  const brands = await brandModel.find({ categoryId });
  return res.json({ message: "success", brands });
};

export const updateBrand = async (req, res, next) => {
  const { brandId } = req.params;
  const { name, categoryId } = req.body;

  const brand = await brandModel.findById(brandId);
  if (!brand) {
    return next(new Error("Brand not found", { cause: 409 }));
  }

  if (name) {
    if (brand.name == name) {
      return next(new Error("Brand name is same as previous", { cause: 409 }));
    }
    if (await brandModel.findOne({ name })) {
      return next(new Error("Brand name already exists", { cause: 409 }));
    }
    brand.name = name;
  }

  if (categoryId) {
    brand.categoryId = categoryId;
  }

  if (req.file) {
    const { secure_url, public_id } = await Cloudinary.uploader.upload(
      req.file.path,
      {
        folder: "brands",
      }
    );
    await Cloudinary.uploader.destroy(brand.image.public_id);
    brand.image = { secure_url, public_id };
  }

  await brand.save();
  return res.json({ message: "success", brand });
};
