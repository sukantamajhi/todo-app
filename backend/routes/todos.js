const express = require("express");
const {
	getTodos,
	getTodo,
	createTodo,
	updateTodo,
	deleteTodo,
	toggleTodo,
	reorderTodos,
	getTodoStats,
	bulkUpdateTodos,
} = require("../controllers/todoController");

const { protect } = require("../middleware/auth");
const { validateTodo } = require("../middleware/validation");

const router = express.Router();

// All routes are protected
router.use(protect);

// Routes
router.route("/").get(getTodos).post(validateTodo, createTodo);

router.route("/stats").get(getTodoStats);

router.route("/reorder").patch(reorderTodos);

router.route("/bulk").patch(bulkUpdateTodos);

router
	.route("/:id")
	.get(getTodo)
	.put(validateTodo, updateTodo)
	.delete(deleteTodo);

router.route("/:id/toggle").patch(toggleTodo);

module.exports = router;
