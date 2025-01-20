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
    status: (req, res) => {
        const status = {
            "status": "Running..."
         };
         
         res.send(status);
    },

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
    }
}