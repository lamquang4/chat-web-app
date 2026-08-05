const { DataTypes, Model } = require("sequelize");
const { sequelize } = require("../config/database/mysql.config");
const User = require("./user.entity");

class Session extends Model {}

Session.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: User, key: "id" },
      onDelete: "CASCADE",
    },
    refresh_token_hash: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    user_agent: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    ip_address: {
      type: DataTypes.STRING(45),
      allowNull: true,
      defaultValue: null,
    },
    is_revoked: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    expires_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    last_active_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: "Session",
    tableName: "sessions",
    underscored: true,
    createdAt: "created_at",
    updatedAt: false,
    indexes: [
      { fields: ["user_id"] },
      { fields: ["is_revoked"] },
      { fields: ["expires_at"] },
    ],
  },
);

Session.belongsTo(User, { foreignKey: "user_id", as: "user" });
User.hasMany(Session, { foreignKey: "user_id", as: "sessions" });

module.exports = Session;
