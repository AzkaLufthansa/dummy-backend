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
    "/disableBiometric/:userId", 
    [isAuthenticatedMiddleware.check],
    AuthController.disableBiometric
);
router.post(
    "/verify_password", 
    [isAuthenticatedMiddleware.check],
    AuthController.verifyPassword
);
router.post(
    "/biometricLogin", 
    AuthController.biometricLogin
);
router.post(
    '/check_biometric/:userId', 
    [isAuthenticatedMiddleware.check],
    AuthController.checkBiometric
)

module.exports = router;