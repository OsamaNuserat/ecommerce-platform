import moment from "moment";
import productModel from "../../../../DB/Model/product.model.js";
import orderModel from "../../../../DB/Model/order.model.js";

export const createOrder = async (req, res, next) => {
  const { products, address, phoneNumber, couponName } = req.body;

  if (couponName) {
    const coupon = await couponModel.findOne({ name: couponName });
    if (!coupon) {
      return next(new Error("Coupon not found", { cause: 404 }));
    }
    let now = moment();
    let expireDate = moment(coupon.expireDate, "MM/DD/YYYY");
    let diff = expireDate.diff(expireDate, "days");
    if (diff >= 0) {
      return next(new Error("Coupon expired", { cause: 409 }));
    }
    if (coupon.usedBy.includes(req.user._id)) {
      return next(new Error("Coupon already used", { cause: 409 }));
    }
    req.body.coupon = coupon;
  }

  const finalProductList = [];
  let subtotal = 0;
  for (const product of products) {
    const checkProducts = await productModel.findOne({
      _id: product.productId,
      stock: { $gte: product.quantity },
      isDeleted: false,
    });
    if (!checkProducts) {
      return next(new Error("Product not found", { cause: 404 }));
    }
    product.unitPrice = checkProducts.totalPrice;
    product.totalPrice = checkProducts.totalPrice * product.quantity;
    subtotal += product.totalPrice;
    finalProductList.push(product);
  }

  const order = await orderModel.create({
    userId: req.user._id,
    address,
    phoneNumber,
    products: finalProductList,
    subtotal,
    finalPrice:
      subtotal -
      subtotal * ((req.body.coupon ? req.body.coupon.amount : 0) / 100),
    couponId: req.body.coupon ? req.body.coupon._id : null,
    paymentType: req.body.paymentType,
    status: paymentType === "Cash" ? "Pending" : "Accepted",
  });

  for (const product of products) {
    await productModel.updateOne(
      { _id: product.productId },
      { $inc: { stock: -product.quantity } }
    );
  }

  if (couponName) {
    await couponModel.updateOne(
      { _id: req.body.coupon._id },
      { $addToSet: { usedBy: req.user._id } }
    );
  }

  await cartModel.updateOne(
    { userId: req.user._id },
    {
      $pull: {
        products: {
          productId: { $in: products.map((p) => p.productId) },
        },
      },
    }
  );

  return res.status(201).json({ message: "success", order });
};

export const createOrderWithCart = async (req, res, next) => {
  const { address, phoneNumber, couponName, paymentType } = req.body;
  const cart = await cartModel.findOne({ userId: req.user._id });

  if (!cart?.products?.length) {
    return next(new Error("Cart not found", { cause: 404 }));
  }

  req.body.products = cart.products;

  if (couponName) {
    const coupon = await couponModel.findOne({ name: couponName });
    if (!coupon) {
      return next(new Error("Coupon not found", { cause: 404 }));
    }
    let now = moment();
    let expireDate = moment(coupon.expireDate, "MM/DD/YYYY");
    let diff = expireDate.diff(expireDate, "days");
    if (diff >= 0) {
      return next(new Error("Coupon expired", { cause: 409 }));
    }
    if (coupon.usedBy.includes(req.user._id)) {
      return next(new Error("Coupon already used", { cause: 409 }));
    }
    req.body.coupon = coupon;
  }

  const finalProductList = [];
  const productIds = [];
  let subtotal = 0;
  for (let product of req.body.products) {
    const checkProduct = await productModel.findOne({
      _id: product.productId,
      stock: { $gte: product.quantity },
      isDeleted: false,
    });
    if (!checkProduct) {
      return next(new Error("Product not found", { cause: 404 }));
    }
    product = product.toObject();
    product.unitPrice = checkProduct.totalPrice;
    product.totalPrice = checkProduct.totalPrice * product.quantity;
    subtotal += product.totalPrice;
    productIds.push(product.productId);
    finalProductList.push(product);
  }

  const order = await orderModel.create({
    userId: req.user._id,
    address,
    phoneNumber,
    products: finalProductList,
    subtotal,
    finalPrice:
      subtotal -
      subtotal * ((req.body.coupon ? req.body.coupon.amount : 0) / 100),
    couponId: req.body.coupon ? req.body.coupon._id : null,
    paymentType,
    status: paymentType === "Cash" ? "Pending" : "Accepted",
  });

  for (const product of req.body.products) {
    await productModel.updateOne(
      { _id: product.productId },
      { $inc: { stock: -product.quantity } }
    );
  }

  if (couponName) {
    await couponModel.updateOne(
      { _id: req.body.coupon._id },
      { $addToSet: { usedBy: req.user._id } }
    );
  }

  await cartModel.updateOne(
    { userId: req.user._id },
    {
      products: [],
    }
  );

  return res.json({ message: "success", order });
};

export const cancelOrder = async (req, res, next) => {
  const { orderId } = req.params;
  const { reasonofRejection } = req.body;
  const order = await orderModel.findOne({
    _id: orderId,
    userId: req.user._id,
  });
  if (!order || order.status !== "Pending" || order.paymentType === "Card") {
    return next(new Error("Order not found", { cause: 404 }));
  }
  await orderModel.updateOne(
    {
      _id: orderId,
    },
    {
      status: "Cancelled",
      reasonofRejection,
    }
  );

  for (const product of order.products) {
    await productModel.updateOne({
      _id: product.productId,
    }, {
      $inc: { stock: product.quantity }
    })
  }
  if (order.couponId) {
    await couponModel.updateOne(
      { _id: order.couponId },
      { $pull: { usedBy: req.user._id } }
    );
  }
  return res.json({ message: "success" });
};

export const updateOrderStatus = async (req, res, next) => { 
  const { orderId } = req.params;
  const { status } = req.body;
  const order = await orderModel.findOne({
    _id: orderId,
    userId: req.user._id,
  });
  if (!order) {
    return next(new Error("Order not found", { cause: 404 }));
  }
  await orderModel.updateOne(
    {
      _id: orderId,
    },
    {
      status,
      updatedBy: req.user._id,
    }
  );
  return res.json({ message: "success" });
};
