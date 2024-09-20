import userModel from "../../DB/Model/user.model.js";
import { asyncHandler } from "../Services/ErrorHandling.js";
import { verifyToken } from "../Services/GenerateAndVerifyToken.js";

export const roles = {
  admin: "admin",
  user: "user",
};

const auth = (accessRoles = []) => {
  return asyncHandler(async (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization) {
      return next(new Error("Unauthorized", { cause: 401 }));
    }

    const token = authorization.split(process.env.BEARER_KEY)[1];
    if (!token) {
      return next(new Error("Unauthorized", { cause: 401 }));
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return next(new Error("Unauthorized", { cause: 401 }));
    }

    const user = await userModel.findById(decoded.id).select("name roles");

    if (!user) {
      return next(new Error("Not Registered email", { cause: 401 }));
    }

    if (accessRoles.length && !accessRoles.includes(user.roles)) {
      return next(new Error("Not Authorized User", { cause: 401 }));
    }

    if (parseInt(user.changePasswordTime?.getTime() / 1000) > decoded.iat) {
      return next(new Error("Expired Token", { cause: 401 }));
    }

    req.user = user;
    next();
  });
};

export default auth;
