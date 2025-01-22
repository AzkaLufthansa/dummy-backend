const { DataTypes } = require("sequelize");
const crypto = require('crypto');
const { check } = require("../middlewares/IsAuthenticatedMiddleware");
const { checkBiometric, disableBiometric } = require("../../auth/controllers/AuthController");

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
    },

    activateBiometric: (query, publicKey) => {
      return this.model.update(
          { public_key: publicKey },
          { where: query }
      );
    },

    disableBiometric: (query) => {
      return this.model.update(
          { public_key: null },
          { where: query }
      );
    },

    biometricLogin: async (userId, signature) => {
      try {
        // Query user enrolled public key
        const user = await this.model.findByPk(userId);
        if (!user) {
          throw new Error("User not found");
        }
        const publicKey = user.public_key;
        const pemKey = "-----BEGIN PUBLIC KEY-----\n" + publicKey + "\n-----END PUBLIC KEY-----";

        // Verify the signature using the public key
        const verifier = crypto.createVerify('sha256WithRSAEncryption');
        verifier.update('This is the payload');
        verifier.end();

        const isVerified = verifier.verify(pemKey, signature, 'base64');
        if (!isVerified) {
          throw new Error("Invalid signature");
        }

        return user;
      } catch (error) {
          console.error("Error during biometric login:", error);
          throw error;
      }
    },
};