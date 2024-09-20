import orderModel from "../../../../DB/Model/order.model.js";
import reviewModel from "../../../../DB/Model/review.model.js";

export const createReview = async (req, res) => {
  const { productId } = req.params;
  const { comment, rating } = req.body;

  const order = await orderModel.findOne({
    userId: req.user._id,
    status: "Delivered",
    "products.productId": productId,
  });

  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  const checkReview = await reviewModel.findOne({
    createdBy: req.user._id,
    productId,
  });
  if (checkReview) {
    return res
      .status(400)
      .json({ message: "You have already reviewed this product" });
  }
  const review = await reviewModel.create({
    comment,
    rating,
    productId,
    orderId: order._id,
    createdBy: req.user._id,
  });
  return res.status(201).json({ message: "success", review });
};

export const updateReview = async (req, res, next) => {
  const { reviewId, productId } = req.params;
  const review = await reviewModel.findByIdAndUpdate(
    {
      _id: reviewId,
      createdBy: req.user._id,
      productId,
    },
    req.body,
    { new: true }
  );

  return res.status(200).json({ message: "success", review });
};
