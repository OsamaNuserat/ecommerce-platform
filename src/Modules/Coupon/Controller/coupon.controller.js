import couponModel from "../../../../DB/Model/coupon.model.js";

export const createCoupon = async (req, res, next) => {
  const { name, amount } = req.body;

  let date = new Date(req.body.expireDate);
  let now = new Date();
  if (date.getTime() < now.getTime()) {
    return next(new Error("Invalid date", { cause: 409 }));
  }

  date = date.toLocaleDateString();
  req.body.expireDate = date;

  if (await couponModel.findOne({ name })) {
    return next(new Error("Coupon name already exists", { cause: 409 }));
  }

  req.body.createdBy = req.user._id;
  req.body.updatedBy = req.user._id;

  const coupon = await couponModel.create(
    req.body
  );
  return res.status(201).json({ message: "success", coupon });
};

export const updateCoupon = async (req, res, next) => {
  const { couponId } = req.params;
  const { name } = req.body;

  const coupon = await couponModel.findById(couponId);
  if (!coupon) {
    return next(new Error("Coupon not found", { cause: 409 }));
  }

  if (name) {
    if (coupon.name == name) {
      return next(new Error("Coupon name is same as previous", { cause: 409 }));
    }
    if (await couponModel.findOne({ name })) {
      return next(new Error("Coupon name already exists", { cause: 409 }));
    }
    coupon.name = name;
  }

  if (req.body.amount) {
    coupon.amount = req.body.amount;
  }

  await coupon.save();
  return res.status(200).json({ message: "success", coupon });
};

export const getAllCoupons = async (req, res, next) => {
  const coupons = await couponModel.find();
  return res.status(200).json({ message: "success", coupons });
};

export const getCoupon = async (req, res, next) => {
  const { couponId } = req.params;
  const coupon = await couponModel.findById(couponId);
  if (!coupon) {
    return next(new Error("Coupon not found", { cause: 409 }));
  }
  return res.status(200).json({ message: "success", coupon });
};
