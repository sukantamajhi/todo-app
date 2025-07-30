const express = require("express");
const {
	register,
	login,
	logout,
	getMe,
	updateDetails,
	updatePreferences,
} = require("../controllers/authController");

const { protect } = require("../middleware/auth");
const {
	validateUserRegistration,
	validateUserLogin,
} = require("../middleware/validation");

const router = express.Router();

router.post("/register", validateUserRegistration, register);
router.post("/login", validateUserLogin, login);
router.get("/logout", logout);
router.get("/me", protect, getMe);
router.put("/updatedetails", protect, updateDetails);
router.put("/preferences", protect, updatePreferences);

module.exports = router;
