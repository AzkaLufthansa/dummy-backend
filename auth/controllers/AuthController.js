const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const { jwtSecret, jwtExpirationInSeconds } = require("../../config");

const UserModel = require("../../common/models/User");

const generateAccessToken = (username, userId) => {
    return jwt.sign(
        {
            userId,
            username,
        },
        jwtSecret,
        {
            expiresIn: jwtExpirationInSeconds,
        }
    );
};

const encryptPassword = (password) => {
    // Creating SHA-256 hash object
    const hash = crypto.createHash("sha256");
    // Update the hash object with the string to be encrypted
    hash.update(password);
    // Get the encrypted value in hexadecimal format
    return hash.digest("hex");
};

module.exports = {
    register: (req, res) => {
        const payload = req.body;
        
        let encryptedPassword = encryptPassword(payload.password);
    
        UserModel.createUser(
          Object.assign(payload, { password: encryptedPassword})
        )
          .then((user) => {
           const accessToken = generateAccessToken(payload.username, user.id);
    
           return res.status(200).json({
             status: true,
             result: {
               user: user.toJSON(),
               token: accessToken,
             },
          });
        })
          .catch((err) => {
            return res.status(500).json({
              status: false,
              error: err,
            });
          })
    },

    login: (req, res) => {
        const { username, password } = req.body;
        console.log(username, password);
    
        UserModel.findUser({ username })
          .then((user) => {
            // IF user is not found with the given username
            if (!user) {
              return res.status(400).json({
                status: false,
                error: {
                  message: `Could not find any user with username: \`${username}\`.`,
                },
              });
            }
    
            const encryptedPassword = encryptPassword(password);
    
            // If Provided password does not match with the one stored in the DB
            if (user.password !== encryptedPassword) {
              return res.status(400).json({
                status: false,
                error: {
                  message: `Provided username and password did not match.`,
                },
              });
            }
    
            // Generating an AccessToken for the user
            const accessToken = generateAccessToken(user.username, user.id);
    
            return res.status(200).json({
              status: true,
              data: {
                user: user.toJSON(),
                token: accessToken,
              },
            });
          })
          .catch((err) => {
            return res.status(500).json({
              status: false,
              error: err,
            });
          });
      },

    getAllUsers: (req, res) => {
        UserModel.findAllUsers(req.query)
            .then((users) => {
                return res.status(200).json({
                status: true,
                data: users,
                });
          })
          .catch((err) => {
                return res.status(500).json({
                    status: false,
                    error: err,
                });
          });
    },

    deleteUser: (req, res) => {
        const {
          params: { userId },
        } = req;

        UserModel.deleteUser({ id: userId })
            .then((numberOfEntriesDeleted) => {
                return res.status(200).json({
                    status: true,
                    data: {
                        numberOfUsersDeleted: numberOfEntriesDeleted
                    },
                });
            })
          .catch((err) => {
                return res.status(500).json({
                    status: false,
                    error: err,
                });
          });
    },

    getAllUsers: (req, res) => {
        UserModel.findAllUsers(req.query)
            .then((users) => {
                return res.status(200).json({
                    status: true,
                    data: users,
                });
            })
            .catch((err) => {
                return res.status(500).json({
                    status: false,
                    error: err,
                });
            });
    },

    activateBiometric: (req, res) => {
        const {
            params: { userId },
        } = req;

        const { publicKey } = req.body;

        UserModel.activateBiometric({ id: userId }, publicKey)
            .then((result) => {
                return res.status(200).json({
                    status: true,
                    data: result,
                });
            })
            .catch((err) => {
                return res.status(500).json({
                    status: false,
                    error: err,
                });
            })
    },

    biometricLogin: (req, res) => {
        const { userId, signature } = req.body;
        
        UserModel.biometricLogin(userId, signature)
            .then((result) => {
                return res.status(200).json({
                    status: true,
                    message: "Authentication successful!",
                    data: result,
                });
            })
            .catch((err) => {
                return res.status(500).json({
                    status: false,
                    message: "Authentication failed! " + err.message,
                    error: err,
                });
            })
    },

    verifyPassword: (req, res) => {
      const { username, password } = req.body;
      
      UserModel.findUser({ username })
         .then((user) => {
            // IF user is not found with the given username
            if (!user) {
              return res.status(400).json({
                status: false,
                error: {
                  message: `Could not find any user with username: \`${username}\`.`,
                },
              });
            }
    
            const encryptedPassword = encryptPassword(password);
    
            // If Provided password does not match with the one stored in the DB
            if (user.password !== encryptedPassword) {
              return res.status(500).json({
                  status: false,
                  message: "Password is invalid!",
                  error: "Password is invalid!",
              });
            }
    
            return res.status(200).json({
              status: true,
              message: "Password is valid!",
            });
          })
         .catch((err) => {
              return res.status(500).json({
                  status: false,
                  message: "Password is invalid!",
                  error: err,
              });
          })
    },


}