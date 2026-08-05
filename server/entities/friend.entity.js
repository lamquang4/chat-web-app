const { DataTypes, Model } = require("sequelize");
const { sequelize } = require("../config/database/mysql.config");
const User = require("./user.entity");

class Friend extends Model {}

Friend.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    requester_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: User, key: "id" },
      onDelete: "CASCADE",
    },
    receiver_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: User, key: "id" },
      onDelete: "CASCADE",
    },
    status: {
      type: DataTypes.ENUM("pending", "accepted", "rejected"),
      defaultValue: "pending",
    },
  },
  {
    sequelize,
    modelName: "Friend",
    tableName: "friends",
    underscored: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    indexes: [
      { fields: ["requester_id"] },
      { fields: ["receiver_id"] },
      { unique: true, fields: ["requester_id", "receiver_id"] },
    ],
    validate: {
      cannotFriendSelf() {
        if (this.requester_id === this.receiver_id) {
          throw new Error("Không thể tự kết bạn với chính mình");
        }
      },
    },
  },
);

Friend.belongsTo(User, { foreignKey: "requester_id", as: "requester" });
Friend.belongsTo(User, { foreignKey: "receiver_id", as: "receiver" });

module.exports = Friend;
