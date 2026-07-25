const { DataTypes, Model } = require("sequelize");
const { sequelize } = require("../config/mysql.config");

class Otp extends Model {}

Otp.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    otp_code_hash: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    expires_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Otp",
    tableName: "otps",
    underscored: true,
    createdAt: "created_at",
    updatedAt: false,
    indexes: [
      { fields: ["email"] },
      { fields: ["expires_at"] }, // hỗ trợ query dọn OTP hết hạn nhanh hơn
    ],
  },
);

module.exports = Otp;
