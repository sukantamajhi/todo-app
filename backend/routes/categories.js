const express = require("express");
const {
	getCategories,
	getCategory,
	createCategory,
	updateCategory,
	deleteCategory,
	createDefaultCategories,
} = require("../controllers/categoryController");

const { protect } = require("../middleware/auth");
const { validateCategory } = require("../middleware/validation");

const router = express.Router();

// All routes are protected
router.use(protect);

// Routes
router.route("/").get(getCategories).post(validateCategory, createCategory);

router.route("/defaults").post(createDefaultCategories);

router
	.route("/:id")
	.get(getCategory)
	.put(validateCategory, updateCategory)
	.delete(deleteCategory);

module.exports = router;
