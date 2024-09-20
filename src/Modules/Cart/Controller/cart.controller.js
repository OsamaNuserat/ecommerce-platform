import cartModel from "../../../../DB/Model/cart.model.js";
import productModel from "../../../../DB/Model/product.model.js";

export const createCart = async (req, res, next) => {
  const { productId, quantity } = req.body;
  const product = await productModel.findById(productId);
  if (!product) {
    return next(new Error("Product not found", { cause: 404 }));
  }
  if (product.stock <= quantity) {
    return next(new Error("Out of stock", { cause: 400 }));
  }
  const cart = await cartModel.findOne({ userId: req.user._id });
  if (!cart) {
    const newCart = await cartModel.create({
      userId: req.user._id,
      products: [{ productId, quantity }],
    });
    return res.json({ message: "success", newCart });
  }
  let matchedProducts = false;
  for (let i = 0; i < cart.products.length; i++) {
    if (cart.products[i].productId.toString() === productId) {
      cart.products[i].quantity += quantity;
      matchedProducts = true;
      break;
    }
  }
  if (!matchedProducts) {
    cart.products.push({ productId, quantity });
  }
  await cart.save();
  res.json({ message: "success", cart });
};

export const getCart = async (req, res, next) => {
  const cart = await cartModel.findOne({ userId: req.user._id });
  return res.json({ message: "success", cart });
};

export const deleteItem = async (req, res, next) => {
  const { productId } = req.params;
  const cart = await cartModel.findOne({ userId: req.user._id });
  if (!cart) {
    return next(new Error("Cart not found", { cause: 404 }));
  }
  cart.products = cart.products.filter(
    (product) => product.productId.toString() !== productId
  );
  await cart.save();
  return res.json({ message: "success", cart });
};

export const clearCart = async (req, res, next) => {
  const cart = await cartModel.findOne({ userId: req.user._id });
  if (!cart) {
    return next(new Error("Cart not found", { cause: 404 }));
  }
  cart.products = [];
  await cart.save();
  return res.json({ message: "success", cart });
};
