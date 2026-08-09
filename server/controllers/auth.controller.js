const authService = require("../services/auth.service");
const response = require("../utils/response.util");

const register = async (req, res, next) => {
  try {
    await authService.register(req.body);

    return response.success(res, {
      message: "Đã gửi mã OTP tới email, vui lòng xác thực để hoàn tất đăng ký",
      data: null,
      status: 200,
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const result = await authService.login({
      ...req.body,
      user_agent: req.headers["user-agent"],
      ip_address: req.ip,
    });

    return response.success(res, {
      message: "Đăng nhập thành công",
      data: result,
      status: 200,
    });
  } catch (error) {
    next(error);
  }
};

const verifyRegisterOtp = async (req, res, next) => {
  try {
    await authService.verifyRegisterOtp(req.body);

    return response.success(res, {
      message: "Xác thực OTP thành công",
      data: null,
      status: 201,
    });
  } catch (error) {
    next(error);
  }
};

const resendRegisterOtp = async (req, res, next) => {
  try {
    await authService.resendRegisterOtp(req.body.email);

    return response.success(res, {
      message: "Đã gửi lại mã OTP",
      data: null,
      status: 200,
    });
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    await authService.logout(req.user.id, req.session.id);

    return response.success(res, {
      message: "Đăng xuất thành công",
      data: null,
      status: 200,
    });
  } catch (error) {
    next(error);
  }
};

const refreshToken = async (req, res, next) => {
  try {
    const result = await authService.refreshToken(req.body.refresh_token);

    return response.success(res, {
      message: "Làm mới token thành công",
      data: result,
      status: 200,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  logout,
  verifyRegisterOtp,
  resendRegisterOtp,
  refreshToken,
};
