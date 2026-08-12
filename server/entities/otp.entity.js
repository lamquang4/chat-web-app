const { DataTypes, Model } = require("sequelize");
const { sequelize } = require("../config/database/mysql.config");

class Otp extends Model {}

Otp.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    otp_code_hash: {
      type: DataTypes.STRING(60),
      allowNull: false,
    },
    attempts: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
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
    indexes: [{ fields: ["email"] }, { fields: ["expires_at"] }],
  },
);

module.exports = Otp;
