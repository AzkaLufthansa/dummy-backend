const router = require("express").Router();

// Middleware Imports
const isAuthenticatedMiddleware = require("./../common/middlewares/IsAuthenticatedMiddleware.js");

// Controller Imports
const AuthController = require("./controllers/AuthController");

router.post("/register", AuthController.register);
router.post("/login", AuthController.login);

router.delete(
    "/delete/:userId", 
    [isAuthenticatedMiddleware.check],
    AuthController.deleteUser
);
router.get(
    "/users", 
    [isAuthenticatedMiddleware.check],
    AuthController.getAllUsers
);

router.post(
    "/activateBiometric/:userId", 
    [isAuthenticatedMiddleware.check],
    AuthController.activateBiometric
);
router.post(
    "/biometricLogin", 
    AuthController.biometricLogin
);

module.exports = router;