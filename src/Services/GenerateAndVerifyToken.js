import jwt from "jsonwebtoken";

export const generateToken = (
  payload,
  signature = process.env.SIGNATURE,
  expiresIn = process.env.EXPIRES_IN
) => {
  try {
    const token = jwt.sign(payload, signature, { expiresIn });
    return token;
  } catch (error) {
    throw new Error("generating token failed");
  }
};

export const verifyToken = (token, signature = process.env.SIGNATURE) => {
  try {
    const tokenVerify = jwt.verify(token, signature);
    return tokenVerify;
  } catch (error) {
    throw new Error("token verification failed");
  }
};
