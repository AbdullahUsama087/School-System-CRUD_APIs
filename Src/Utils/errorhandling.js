const asyncHandler = function (API) {
  return (req, res, next) => {
    API(req, res, next).catch((err) => {
      console.error(err);
      res.status(500).json({ message: "Error" });
    });
  };
};

const globalErrorResponse = (err, req, res, next) => {
  if (err) {
    if (req.validationErrorArr) {
      return res
        .status(err.cause || 400)
        .json({ message: req.validationErrorArr });
    }
    return res.status(err.cause || 500).json({ message: err.message });
  }
};

const globalNotFoundPageError = (req, res, next) => {
  return next(new Error("Page Not Found", { cause: 404 }));
};

export { asyncHandler, globalNotFoundPageError, globalErrorResponse };
