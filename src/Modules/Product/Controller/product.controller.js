import subCategoryModel from "../../../../DB/Model/subCategory.model.js";
import brandModel from "../../../../DB/Model/brand.model.js";
import slugify from "slugify";
import Cloudinary from "../../../Services/Cloudinary.js";
import productModel from "../../../../DB/Model/product.model.js";

export const createProduct = async (req, res, next) => {
  const { name, price, discount, categoryId, subCategoryId, brandId } =
    req.body;
  const checkCategory = await subCategoryModel.findOne({
    _id: subCategoryId,
    categoryId,
  });
  if (!checkCategory) {
    return next(new Error("Category or SubCategory not found", { cause: 404 }));
  }
  const checkBrand = await brandModel.findById(brandId);
  if (!checkBrand) {
    return next(new Error("Brand not found", { cause: 404 }));
  }
  req.body.slug = slugify(name);
  req.body.finalPrice = price - price * ((discount || 0) / 100);

  req.body.createdBy = req.user._id;
  req.body.updatedBy = req.user._id;

  const fieldsToArray = ["colors", "sizes"];

  fieldsToArray.forEach((field) => {
    if (!Array.isArray(req.body[field])) {
      req.body[field] = [req.body[field]];
    }
  });

  if (req.files && req.files.mainImage && req.files.mainImage.length > 0) {
    const { secure_url, public_id } = await Cloudinary.uploader.upload(
      req.files.mainImage[0].path,
      {
        folder: "Product Main Images",
      }
    );
    req.body.mainImage = { secure_url, public_id };
  } else {
    return next(new Error("Main image is required"));
  }

  if (req.files && req.files.subImages) {
    req.body.subImages = [];
    for (const file of req.files.subImages) {
      const { secure_url, public_id } = await Cloudinary.uploader.upload(
        file.path,
        {
          folder: "Product Sub Images",
        }
      );
      req.body.subImages.push({ secure_url, public_id });
    }
  }

  const product = await productModel.create(req.body);
  return res.status(201).json({ message: "success", product });
};

export const updateProduct = async (req, res, next) => {
  const { productId } = req.params;
  const product = await productModel.findById(productId);

  if (!product) {
    return next(new Error("Product not found", { cause: 404 }));
  }

  const { name, price, discount, categoryId, subCategoryId, brandId } =
    req.body;

  if (categoryId && subCategoryId) {
    const checkSubCategory = await subCategoryModel.findOne({
      _id: subCategoryId,
      categoryId,
    });

    if (!checkSubCategory) {
      return next(
        new Error("Category or SubCategory not found", { cause: 404 })
      );
    } else {
      product.categoryId = categoryId;
      product.subCategoryId = subCategoryId;
    }
  } else if (subCategoryId) {
    const checkSubCategory = await subCategoryModel.findOne({
      _id: subCategoryId,
    });
    if (!checkSubCategory) {
      return next(new Error("SubCategory not found", { cause: 404 }));
    } else {
      product.subCategoryId = subCategoryId;
    }
  }
  if (brandId) {
    const checkBrand = await brandModel.findById(brandId);
    if (!checkBrand) {
      return next(new Error("Brand not found", { cause: 404 }));
    }
  }
  if (name) {
    product.name = name;
    product.slug = slugify(name);
  }
  if (req.body.description) {
    product.description = req.body.description;
  }
  if (req.body.stock) {
    product.stock = req.body.stock;
  }
  if (req.body.colors) {
    product.colors = req.body.colors;
  }
  if (req.body.sizes) {
    product.sizes = req.body.sizes;
  }

  if (price && discount) {
    product.price = price;
    product.discount = discount;
    product.finalPrice = price - price * ((discount || 0) / 100);
  } else if (price) {
    product.price = price;
    product.finalPrice = price - price * ((product.discount || 0) / 100);
  } else if (discount) {
    product.discount = discount;
    product.finalPrice =
      product.price - product.price * ((discount || 0) / 100);
  }
  if (req.files.mainImage.length) {
    const { secure_url, public_id } = await Cloudinary.uploader.upload(
      req.files.mainImage[0].path,
      {
        folder: "Product Main Images",
      }
    );
    product.secure_url = secure_url;
    product.public_id = public_id;
  }
  if (req.files.subImages) {
    product.subImages = [];
    for (const file of req.files.subImages) {
      const { secure_url, public_id } = await Cloudinary.uploader.upload(
        file.path,
        {
          folder: "Product Sub Images",
        }
      );
      product.subImages.push({ secure_url, public_id });
    }
  }
  product.updatedBy = req.user._id;
  const newProduct = await product.save();
  return res.status(200).json({ message: "success", newProduct });
};

export const softDeleteProduct = async (req, res, next) => {
  const { productId } = req.params;
  const product = await productModel.findOneAndUpdate(
    { _id: productId, isDeleted: false },
    { isDeleted: true },
    { new: true }
  );

  if (!product) {
    return next(new Error("Product not found", { cause: 404 }));
  }

  return res.json({ message: "success", product });
};

export const deleteProduct = async (req, res, next) => {
  const { productId } = req.params;
  const product = await productModel.findOneAndDelete({
    _id: productId,
    isDeleted: true,
  });

  if (!product) {
    return next(new Error("Product not found", { cause: 404 }));
  }

  return res.json({ message: "success", product });
};

export const restoreProduct = async (req, res, next) => {
  const { productId } = req.params;
  const product = await productModel.findOneAndUpdate(
    { _id: productId, isDeleted: true },
    { isDeleted: false },
    { new: true }
  );

  if (!product) {
    return next(new Error("Product not found", { cause: 404 }));
  }

  return res.json({ message: "success", product });
};

export const getSoftDeletedProducts = async (req, res, next) => {
  const products = await productModel.find({ isDeleted: true });
  return res.json({ message: "success", products });
};

export const getProduct = async (req, res, next) => {
  const { productId } = req.params;
  const product = await productModel.findById(productId);
  return res.json({ message: "success", product });
};

export const getAllProducts = async (req, res, next) => {
  let { page, size } = req.query;
  page = parseInt(page) || 1;
  size = parseInt(size) || 10;

  if (page < 1 || !page) {
    page = 1;
  }

  if (size < 1 || !size) {
    size = 10;
  }

  const skip = (page - 1) * size;

  const excQueryParams = ["page", "size",'sort','search'];

  const filterQuery = { ...req.query };

  excQueryParams.map(params=> {
    delete filterQuery[params];
  })

  const query = JSON.parse(
    JSON.stringify(filterQuery).replace(
      /\b(gt|gte|lt|lte|in)\b/g,
      (match) => `$${match}`
    )
  );

    const mongoQuery = await productModel.find(query).limit(size).skip(skip)
    .sort(req.query.sort?.replaceAll(',', ' '));

    const products = await mongoQuery.find({
      $or: [
        { name: { $regex: new RegExp(req.query.search, "i") } },
        { description: { $regex: new RegExp(req.query.search, "i") } },
      ],
    })

    if(!products) {
      return next(new Error("No products found", { cause: 404 }));
    }

  return res.json({ message: "success", products });
};
