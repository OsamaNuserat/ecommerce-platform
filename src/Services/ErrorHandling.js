export const asyncHandler = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch((error) => {
      return next(new Error(error.message || error)); // Ensure it's a string
    });
  };
};


export const globalErrorHandler = (error, req, res, next) => {
  if (error) {
    if (process.env.NODE_ENV === "DEV") {
      return res
        .status(error.cause || 500) // Status code (500 if not specified).
        .json({ message: "catch error", error: error.stack }); // Include stack trace.
    }
    return res.status(error.cause || 500).json({ message: "catch error" });
  }
};