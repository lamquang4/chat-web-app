const cron = require("node-cron");
const { Op } = require("sequelize");
const Session = require("../entities/session.entity");

// Dọn các session đã hết hạn
const startSessionCleanupJob = () => {
  cron.schedule("0 3 * * *", async () => {
    try {
      const deletedCount = await Session.destroy({
        where: {
          expires_at: { [Op.lt]: new Date() },
        },
      });

      if (deletedCount > 0) {
        console.log(
          `[CLEANUP] Đã xóa ${deletedCount} session hết hạn/đã revoke`,
        );
      }
    } catch (error) {
      console.error("[CLEANUP] Lỗi khi dọn session:", error.message);
    }
  });

  console.log(
    "[CLEANUP] Session cleanup job đã được lên lịch (mỗi ngày 3:00 sáng)",
  );
};

module.exports = startSessionCleanupJob;
