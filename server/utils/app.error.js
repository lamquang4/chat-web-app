class AppError extends Error {
  constructor(errorCode, overrideMessage) {
    super(overrideMessage || errorCode.message);
    this.status = errorCode.status;
    this.code = errorCode.code;

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
