import mongoose from "mongoose";

const connectDB = async () => {
  return await mongoose
    .connect(process.env.MY_DB)
    .then((result) => {
      console.log("database connected");
    })
    .catch((error) => {
      console.log("database error", error);
    });
};

export default connectDB;
