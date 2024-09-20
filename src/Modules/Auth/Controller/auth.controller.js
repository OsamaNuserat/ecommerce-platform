import { customAlphabet } from "nanoid";
import userModel from "../../../../DB/Model/user.model.js";
import {
  generateToken,
  verifyToken,
} from "../../../Services/GenerateAndVerifyToken.js";
import {
  comparePassword,
  hashPassword,
} from "../../../Services/HashAndCompare.js";
import { sendEmail } from "../../../Services/nodeMailer.js";

export const signup = async (req, res, next) => {
  const { name, email, password } = req.body;
  const user = await userModel.findOne({ email });
  if (user) {
    return next(new Error("email exists"));
  }
  const hashedPassword = hashPassword(password);

  const token = generateToken({ email }, process.env.CONFIRM_SIGNATURE, 60 * 5);
  const refreshToken = generateToken(
    { email },
    process.env.CONFIRM_SIGNATURE,
    60 * 60 * 24 * 7
  );
  const link = `${req.protocol}://${req.headers.host}/auth/confirm-email/${token}`;
  const Rlink = `${req.protocol}://${req.headers.host}/auth/confirm-email/${refreshToken}`;

  const emailTemplate = `
  <html>
    <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
      <div style="max-width: 600px; margin: auto; background-color: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
        <h2 style="text-align: center; color: #333;">Verify Your Email Address</h2>
        <p>Dear ${name},</p>
        <p>Thank you for signing up! Please click the button below to verify your email address.</p>
        <div style="text-align: center; margin: 20px 0;">
          <a href="${link}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-size: 16px;">Verify Your Email</a>
        </div>
        <p>If the above button doesn't work, you can use the following link:</p>
        <p><a href="${link}" style="color: #4CAF50;">${link}</a></p>
        <hr style="border: none; border-top: 1px solid #f4f4f4;">
        <p>If the token expires, you can refresh it by clicking the button below:</p>
        <div style="text-align: center; margin: 20px 0;">
          <a href="${Rlink}" style="background-color: #FFA500; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-size: 16px;">Refresh Token</a>
        </div>
        <p>If the above button doesn't work, you can use the following link:</p>
        <p><a href="${Rlink}" style="color: #FFA500;">${Rlink}</a></p>
        <p style="color: #888;">If you did not sign up for this account, please ignore this email.</p>
        <p style="color: #888;">Regards,<br>Osama Nuserat</p>
      </div>
    </body>
  </html>
`;

  await sendEmail(email, "Confirm Email", emailTemplate);

  const createUser = await userModel.create({
    name,
    email,
    password: hashedPassword,
  });
  return res.json({ message: "success", createUser });
};

export const confirmEmail = async (req, res, next) => {
  const { token } = req.params;

  const decoded = verifyToken(token, process.env.CONFIRM_SIGNATURE);

  if (!decoded?.email) {
    return next(new Error("Invalid token payload"));
  }
  const user = await userModel.updateOne(
    { email: decoded.email },
    { confirmEmail: true }
  );

  if (!user) {
    return next(new Error("User not found"));
  }

  return res.json({ message: "success, you can login" });
};

export const signin = async (req, res, next) => {
  const { email, password } = req.body;

  const user = await userModel.findOne({ email });
  if (!user) {
    return next(new Error("User not found"));
  }
  if (user.confirmEmail === false) {
    return next(new Error("please confirm your email"));
  }

  const match = comparePassword(password, user.password);
  if (!match) {
    return next(new Error("password doesnt match"));
  }
  const token = generateToken({ id: user._id, isLoggedIn: true });
  const refreshToken = generateToken({ id: user._id, isLoggedIn: true });
  return res.json({ message: "success", token, refreshToken });
};
// todo : add resend email functionality

export const sendResetCode = async (req, res, next) => {
  const { email } = req.body;
  const codeToken = generateToken({ email });
  let code = customAlphabet("1234567890", 4)();
  const user = await userModel.findOneAndUpdate(
    { email },
    { code, codeToken },
    { new: true }
  );

  if (!user) {
    return next(new Error("User not found"));
  }

  const html = `
    <html>
      <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
        <div style="max-width: 600px; margin: auto; background-color: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
          <h2 style="text-align: center; color: #333;">Reset Your Password</h2>
          <p>Dear User,</p>
          <p>We received a request to reset your password. Please use the code below to reset your password:</p>
          <div style="text-align: center; margin: 20px 0;">
            <span style="background-color: #4CAF50; color: white; padding: 10px 20px; font-size: 24px; border-radius: 5px; letter-spacing: 2px;">${code}</span>
          </div>
          <p>If you did not request a password reset, please ignore this email or contact support if you have questions.</p>
          <p style="color: #888;">Regards,<br>Osama Nuserat</p>
        </div>
      </body>
    </html>
  `;

  await sendEmail(email, "Reset Password", html);

  return res.json({ message: "Reset code sent successfully" });
};

export const enterResetCode = async (req, res, next) => {
  const { token } = req.params;
  const { code } = req.body;

  const decoded = verifyToken(token);
  const user = await userModel.findOne({ email: decoded.email });
  if (!user) {
    return next(new Error("User not found", { cause: 400 }));
  }
  if (user.code !== code) {
    return next(new Error("Invalid code", { cause: 400 }));
  }
};

export const resetPassword = async (req, res, next) => {
  const { token } = req.params;
  const { password } = req.body;

  const decoded = verifyToken(token);
  const user = await userModel.findOne({ _id: decoded.id });
  if (!user) {
    return next(new Error("User not found", { cause: 400 }));
  }

  const hashedPassword = hashPassword(password);
  await userModel.updateOne({ _id: decoded.id }, { password: hashedPassword });

  return res.json({ message: "Password reset successfully" });
};
