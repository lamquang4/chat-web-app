const cron = require("node-cron");
const { Op } = require("sequelize");
const Otp = require("../entities/otp.entity");
const User = require("../entities/user.entity");
const { OTP_MAX_ATTEMPTS } = require("../constants/limit");

const startOtpCleanupJob = () => {
  cron.schedule("*/5 * * * *", async () => {
    try {
      //  xóa OTP hết hạn hoặc đã vượt quá số lần thử sai cho phép
      const deletedOtpCount = await Otp.destroy({
        where: {
          [Op.or]: [
            { expires_at: { [Op.lt]: new Date() } },
            { attempts: { [Op.gte]: OTP_MAX_ATTEMPTS } },
          ],
        },
      });

      if (deletedOtpCount > 0) {
        console.log(
          `[CLEANUP] Đã xóa ${deletedOtpCount} OTP hết hạn/quá số lần thử`,
        );
      }

      // xóa user đăng ký dở chưa xác thực
      const pendingEmails = await Otp.findAll({
        attributes: ["email"],
        raw: true,
      });
      const emailsWithPendingOtp = pendingEmails.map((o) => o.email);

      const deletedUserCount = await User.destroy({
        where: {
          is_verified: false,
          email: {
            [Op.notIn]: emailsWithPendingOtp.length
              ? emailsWithPendingOtp
              : [""],
          },
        },
      });

      if (deletedUserCount > 0) {
        console.log(
          `[CLEANUP] Đã xóa ${deletedUserCount} người dùng đăng ký chưa xác thực`,
        );
      }
    } catch (error) {
      console.error(
        "[CLEANUP] Lỗi khi dọn OTP/user chưa xác thực:",
        error.message,
      );
    }
  });

  console.log("[CLEANUP] OTP cleanup job đã được lên lịch (mỗi 5 phút)");
};

module.exports = startOtpCleanupJob;
