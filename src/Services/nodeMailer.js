import nodemailer from "nodemailer";

export const sendEmail = async (to, subject, html) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.APP_PASSWORD,
      },
    });

    const info = await transporter.sendMail({
      from: `Osama Nuserat <${process.env.EMAIL}>`,
      to,
      subject,
      html,
    });
  } catch (e) {
    console.log(e);
  }
};
