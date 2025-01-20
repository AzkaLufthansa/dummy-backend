const router = require("express").Router();
const AuthController = require("./controllers/AuthController");

router.post("/register", AuthController.register);
router.post("/login", AuthController.login);
router.delete("/delete/:userId", AuthController.deleteUser);
router.get("/users", AuthController.getAllUsers);

module.exports = router;