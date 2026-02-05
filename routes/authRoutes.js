const router = require("express").Router();
const auth = require("../controller/authController");

router.post("/register", auth.register);
router.post("/login", auth.login);
router.post("/forgot-password", auth.getSecurityQuestion);
router.post("/reset-password", auth.resetPassword);

module.exports = router;
