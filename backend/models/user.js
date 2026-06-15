"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      //
    }
  }
  User.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      is_active: {
        type: DataTypes.TINYINT,
        allowNull: false,
        defaultValue: 1,
      },
    },
    {
      sequelize,
      modelName: "User",
      tableName: "users",
      underscored: true,
      timestamps: true,
    },
  );
  return User;
};
