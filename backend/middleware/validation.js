const { body, validationResult } = require("express-validator");

// Handle validation errors
const handleValidationErrors = (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({
			success: false,
			message: "Validation failed",
			errors: errors.array(),
		});
	}
	next();
};

// User registration validation
const validateUserRegistration = [
	body("name")
		.trim()
		.notEmpty()
		.withMessage("Name is required")
		.isLength({ min: 2, max: 50 })
		.withMessage("Name must be between 2 and 50 characters"),
	body("email")
		.isEmail()
		.normalizeEmail()
		.withMessage("Please provide a valid email"),
	body("password")
		.isLength({ min: 6 })
		.withMessage("Password must be at least 6 characters long")
		.matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
		.withMessage(
			"Password must contain at least one lowercase letter, one uppercase letter, and one number"
		),
	handleValidationErrors,
];

// User login validation
const validateUserLogin = [
	body("email")
		.isEmail()
		.normalizeEmail()
		.withMessage("Please provide a valid email"),
	body("password").notEmpty().withMessage("Password is required"),
	handleValidationErrors,
];

// Todo validation
const validateTodo = [
	body("title")
		.trim()
		.notEmpty()
		.withMessage("Todo title is required")
		.isLength({ max: 100 })
		.withMessage("Title cannot be more than 100 characters"),
	body("description")
		.optional()
		.isLength({ max: 500 })
		.withMessage("Description cannot be more than 500 characters"),
	body("priority")
		.optional()
		.isIn(["low", "medium", "high", "critical"])
		.withMessage("Priority must be one of: low, medium, high, critical"),
	body("dueDate")
		.optional()
		.isISO8601()
		.withMessage("Due date must be a valid date"),
	body("tags").optional().isArray().withMessage("Tags must be an array"),
	body("tags.*")
		.optional()
		.isLength({ max: 20 })
		.withMessage("Each tag cannot be more than 20 characters"),
	handleValidationErrors,
];

// Category validation
const validateCategory = [
	body("name")
		.trim()
		.notEmpty()
		.withMessage("Category name is required")
		.isLength({ max: 30 })
		.withMessage("Category name cannot be more than 30 characters"),
	body("color")
		.matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)
		.withMessage("Color must be a valid hex color"),
	body("description")
		.optional()
		.isLength({ max: 200 })
		.withMessage("Description cannot be more than 200 characters"),
	handleValidationErrors,
];

module.exports = {
	validateUserRegistration,
	validateUserLogin,
	validateTodo,
	validateCategory,
	handleValidationErrors,
};
