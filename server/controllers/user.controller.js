const userService = require("../services/user.service");
const response = require("../utils/response.util");

const getAccount = async (req, res, next) => {
  try {
    const result = await userService.getAccount(req.user.id);
    return response.success(res, {
      message: "Lấy thông tin tài khoản thành công",
      data: result,
      status: 200,
    });
  } catch (error) {
    next(error);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const result = await userService.updateUser(
      req.user.id,
      req.body,
      req.file,
    );
    return response.success(res, {
      message: "Cập nhật người dùng thành công",
      data: result,
      status: 200,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAccount, updateUser };
