const router = require("express").Router();
const AuthController = require("./controllers/AuthController");

router.get("/status", AuthController.status);
router.post("/register", AuthController.register);

module.exports = router;