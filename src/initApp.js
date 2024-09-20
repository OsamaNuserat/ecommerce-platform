import connectDB from "../DB/connection.js";
import authRouter from "./Modules/Auth/auth.router.js";
import userRouter from "./Modules/User/user.router.js";
import categoryRouter from "./Modules/Category/category.router.js";
import couponRouter from "./Modules/Coupon/coupon.router.js";
import brandRouter from "./Modules/Brand/brand.router.js";
import productRouter from "./Modules/Product/product.router.js";
import cartRouter from "./Modules/Cart/cart.router.js";
import orderRouter from "./Modules/Order/order.router.js";
import reviewRouter from "./Modules/Review/review.router.js";
import { globalErrorHandler } from "./Services/ErrorHandling.js";
const initApp = (app, express) => {
  connectDB();
  app.use(express.json());
  app.use("/auth", authRouter);
  app.use("/user", userRouter);
  app.use("/category", categoryRouter);
  app.use("/coupon", couponRouter);
  app.use("/brand", brandRouter);
  app.use("/product", productRouter);
  app.use("/cart", cartRouter);
  app.use("/order", orderRouter);
  app.use("/review", reviewRouter);
  app.use("*", (req, res) => {
    return res.json({ message: "page not found" });
  });

  // global error handling
  app.use(globalErrorHandler);
};

export default initApp;
