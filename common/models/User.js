const { DataTypes } = require("sequelize");
const crypto = require('crypto');

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

    biometricLogin: async (userId, signature) => {
      try {
        const signatureBuffer = Buffer.from(signature, 'base64');

        // Query user enrolled public key
        const user = await this.model.findByPk(userId);
        if (!user) {
          throw new Error("User not found");
        }
        const publicKey = user.public_key;

        console.log(publicKey)

        // Verify the signature using the public key
        const verifier = crypto.createVerify('sha256WithRSAEncryption');
        verifier.update("{'userId':'5'}");
        verifier.end();

        const isVerified = verifier.verify(publicKey, signatureBuffer, 'base64');
        if (!isVerified) {
          throw new Error("Invalid signature");
        }

        return user;
      } catch (error) {
          console.error("Error during biometric login:", error);
          throw error;
      }
    }
};