class AppError extends Error {
  constructor(errorCode) {
    super(errorCode.message);
    this.status = errorCode.status;
    this.code = Object.keys(require("./error.code")).find(
      (key) => require("./error.code")[key] === errorCode,
    );
  }
}

module.exports = AppError;
