const { ZodError } = require("zod");
const AppError = require("../utils/app.error");
const ErrorCode = require("../utils/error.code");

function validate(schema, source = "body") {
  return (req, res, next) => {
    try {
      const parsed = schema.parse(req[source]);
      req[source] = parsed;
      return next();
    } catch (err) {
      if (err instanceof ZodError) {
        const firstIssue = err.errors[0];
        return next(
          new AppError(ErrorCode.VALIDATION_ERROR, firstIssue?.message),
        );
      }
      return next(err);
    }
  };
}

module.exports = { validate };
