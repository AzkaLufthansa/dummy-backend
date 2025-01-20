const { DataTypes } = require("sequelize");

const UserModel = {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  // For biometric authentication purposes
  public_key: {
    type: DataTypes.TEXT,
    allowNull: true,
    unique: true,
  }
};

module.exports = {
    initialize: (sequelize) => {
        this.model = sequelize.define("user", UserModel);
    },

    createUser: (user) => {
        return this.model.create(user);
    },

    findUser: (query) => {
      return this.model.findOne({
        where: query,
      });
    },

    findAllUsers: (query) => {
      return this.model.findAll({
        where: query
      });
    },
  
    deleteUser: (query) => {
      return this.model.destroy({
        where: query
      });
    }
};