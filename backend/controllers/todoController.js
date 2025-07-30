const Todo = require("../models/Todo");
const Category = require("../models/Category");

// Helper function to emit real-time updates
const emitTodoUpdate = (req, action, todo) => {
	const io = req.app.get("io");
	if (io) {
		io.to(`user_${req.user.id}`).emit("todoUpdate", {
			action,
			todo,
			userId: req.user.id,
		});
	}
};

// @desc    Get all todos for a user
// @route   GET /api/todos
// @access  Private
const getTodos = async (req, res, next) => {
	try {
		const {
			page = 1,
			limit = 10,
			status,
			priority,
			category,
			search,
			sortBy = "createdAt",
			sortOrder = "desc",
			tags,
		} = req.query;

		// Build query
		const query = { user: req.user.id };

		// Filter by completion status
		if (status !== undefined) {
			query.completed = status === "completed";
		}

		// Filter by priority
		if (priority) {
			query.priority = priority;
		}

		// Filter by category
		if (category) {
			query.category = category;
		}

		// Filter by tags
		if (tags) {
			const tagArray = tags.split(",");
			query.tags = { $in: tagArray };
		}

		// Search in title and description
		if (search) {
			query.$or = [
				{ title: { $regex: search, $options: "i" } },
				{ description: { $regex: search, $options: "i" } },
			];
		}

		// Build sort object
		const sort = {};
		sort[sortBy] = sortOrder === "desc" ? -1 : 1;

		// Execute query with pagination
		const skip = (parseInt(page) - 1) * parseInt(limit);

		const todos = await Todo.find(query)
			.populate("category", "name color icon")
			.sort(sort)
			.skip(skip)
			.limit(parseInt(limit));

		// Get total count for pagination
		const total = await Todo.countDocuments(query);

		// Calculate pagination info
		const totalPages = Math.ceil(total / parseInt(limit));
		const hasNextPage = parseInt(page) < totalPages;
		const hasPrevPage = parseInt(page) > 1;

		res.status(200).json({
			success: true,
			data: todos,
			pagination: {
				current: parseInt(page),
				total: totalPages,
				count: todos.length,
				totalCount: total,
				hasNext: hasNextPage,
				hasPrev: hasPrevPage,
			},
		});
	} catch (error) {
		next(error);
	}
};

// @desc    Get single todo
// @route   GET /api/todos/:id
// @access  Private
const getTodo = async (req, res, next) => {
	try {
		const todo = await Todo.findOne({
			_id: req.params.id,
			user: req.user.id,
		}).populate("category", "name color icon");

		if (!todo) {
			return res.status(404).json({
				success: false,
				message: "Todo not found",
			});
		}

		res.status(200).json({
			success: true,
			data: todo,
		});
	} catch (error) {
		next(error);
	}
};

// @desc    Create new todo
// @route   POST /api/todos
// @access  Private
const createTodo = async (req, res, next) => {
	try {
		// Add user to req.body
		req.body.user = req.user.id;

		// If category is provided, verify it belongs to the user
		if (req.body.category) {
			const category = await Category.findOne({
				_id: req.body.category,
				user: req.user.id,
			});

			if (!category) {
				return res.status(400).json({
					success: false,
					message: "Invalid category",
				});
			}
		}

		// Set position for new todo
		if (!req.body.position) {
			const lastTodo = await Todo.findOne({ user: req.user.id }).sort({
				position: -1,
			});
			req.body.position = lastTodo ? lastTodo.position + 1 : 0;
		}

		const todo = await Todo.create(req.body);

		// Populate category before sending response
		await todo.populate("category", "name color icon");

		// Emit real-time update
		emitTodoUpdate(req, "create", todo);

		res.status(201).json({
			success: true,
			data: todo,
		});
	} catch (error) {
		next(error);
	}
};

// @desc    Update todo
// @route   PUT /api/todos/:id
// @access  Private
const updateTodo = async (req, res, next) => {
	try {
		let todo = await Todo.findOne({
			_id: req.params.id,
			user: req.user.id,
		});

		if (!todo) {
			return res.status(404).json({
				success: false,
				message: "Todo not found",
			});
		}

		// If category is being updated, verify it belongs to the user
		if (req.body.category) {
			const category = await Category.findOne({
				_id: req.body.category,
				user: req.user.id,
			});

			if (!category) {
				return res.status(400).json({
					success: false,
					message: "Invalid category",
				});
			}
		}

		// Update progress based on subtasks if subtasks are modified
		if (req.body.subtasks) {
			req.body.progress = todo.calculateProgress();
		}

		todo = await Todo.findByIdAndUpdate(req.params.id, req.body, {
			new: true,
			runValidators: true,
		}).populate("category", "name color icon");

		// Emit real-time update
		emitTodoUpdate(req, "update", todo);

		res.status(200).json({
			success: true,
			data: todo,
		});
	} catch (error) {
		next(error);
	}
};

// @desc    Delete todo
// @route   DELETE /api/todos/:id
// @access  Private
const deleteTodo = async (req, res, next) => {
	try {
		const todo = await Todo.findOne({
			_id: req.params.id,
			user: req.user.id,
		});

		if (!todo) {
			return res.status(404).json({
				success: false,
				message: "Todo not found",
			});
		}

		await todo.deleteOne();

		// Emit real-time update
		emitTodoUpdate(req, "delete", { _id: req.params.id });

		res.status(200).json({
			success: true,
			message: "Todo deleted successfully",
		});
	} catch (error) {
		next(error);
	}
};

// @desc    Toggle todo completion
// @route   PATCH /api/todos/:id/toggle
// @access  Private
const toggleTodo = async (req, res, next) => {
	try {
		let todo = await Todo.findOne({
			_id: req.params.id,
			user: req.user.id,
		});

		if (!todo) {
			return res.status(404).json({
				success: false,
				message: "Todo not found",
			});
		}

		todo.completed = !todo.completed;
		await todo.save();

		// Populate category before sending response
		await todo.populate("category", "name color icon");

		// Emit real-time update
		emitTodoUpdate(req, "update", todo);

		res.status(200).json({
			success: true,
			data: todo,
		});
	} catch (error) {
		next(error);
	}
};

// @desc    Reorder todos
// @route   PATCH /api/todos/reorder
// @access  Private
const reorderTodos = async (req, res, next) => {
	try {
		const { todoIds } = req.body;

		if (!Array.isArray(todoIds)) {
			return res.status(400).json({
				success: false,
				message: "todoIds must be an array",
			});
		}

		// Update positions
		const updatePromises = todoIds.map((todoId, index) =>
			Todo.findOneAndUpdate(
				{ _id: todoId, user: req.user.id },
				{ position: index },
				{ new: true }
			)
		);

		await Promise.all(updatePromises);

		// Emit real-time update
		const io = req.app.get("io");
		if (io) {
			io.to(`user_${req.user.id}`).emit("todosReordered", {
				todoIds,
				userId: req.user.id,
			});
		}

		res.status(200).json({
			success: true,
			message: "Todos reordered successfully",
		});
	} catch (error) {
		next(error);
	}
};

// @desc    Get todo statistics
// @route   GET /api/todos/stats
// @access  Private
const getTodoStats = async (req, res, next) => {
	try {
		const userId = req.user.id;

		// Get basic counts
		const [total, completed, overdue, today, thisWeek] = await Promise.all([
			Todo.countDocuments({ user: userId }),
			Todo.countDocuments({ user: userId, completed: true }),
			Todo.countDocuments({
				user: userId,
				completed: false,
				dueDate: { $lt: new Date() },
			}),
			Todo.countDocuments({
				user: userId,
				dueDate: {
					$gte: new Date().setHours(0, 0, 0, 0),
					$lt: new Date().setHours(23, 59, 59, 999),
				},
			}),
			Todo.countDocuments({
				user: userId,
				dueDate: {
					$gte: new Date().setHours(0, 0, 0, 0),
					$lt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
				},
			}),
		]);

		// Get completion rate
		const completionRate =
			total > 0 ? Math.round((completed / total) * 100) : 0;

		// Get priority breakdown
		const priorityStats = await Todo.aggregate([
			{ $match: { user: userId } },
			{ $group: { _id: "$priority", count: { $sum: 1 } } },
		]);

		// Get category breakdown
		const categoryStats = await Todo.aggregate([
			{ $match: { user: userId } },
			{
				$lookup: {
					from: "categories",
					localField: "category",
					foreignField: "_id",
					as: "categoryInfo",
				},
			},
			{
				$group: {
					_id: {
						categoryId: "$category",
						categoryName: {
							$arrayElemAt: ["$categoryInfo.name", 0],
						},
						categoryColor: {
							$arrayElemAt: ["$categoryInfo.color", 0],
						},
					},
					count: { $sum: 1 },
				},
			},
		]);

		res.status(200).json({
			success: true,
			data: {
				total,
				completed,
				pending: total - completed,
				overdue,
				dueToday: today,
				dueThisWeek: thisWeek,
				completionRate,
				priorityBreakdown: priorityStats,
				categoryBreakdown: categoryStats,
			},
		});
	} catch (error) {
		next(error);
	}
};

// @desc    Bulk update todos
// @route   PATCH /api/todos/bulk
// @access  Private
const bulkUpdateTodos = async (req, res, next) => {
	try {
		const { todoIds, updates } = req.body;

		if (!Array.isArray(todoIds) || todoIds.length === 0) {
			return res.status(400).json({
				success: false,
				message: "todoIds must be a non-empty array",
			});
		}

		const result = await Todo.updateMany(
			{
				_id: { $in: todoIds },
				user: req.user.id,
			},
			updates,
			{ runValidators: true }
		);

		// Get updated todos
		const updatedTodos = await Todo.find({
			_id: { $in: todoIds },
			user: req.user.id,
		}).populate("category", "name color icon");

		// Emit real-time update for each todo
		updatedTodos.forEach((todo) => {
			emitTodoUpdate(req, "update", todo);
		});

		res.status(200).json({
			success: true,
			message: `${result.modifiedCount} todos updated successfully`,
			data: updatedTodos,
		});
	} catch (error) {
		next(error);
	}
};

module.exports = {
	getTodos,
	getTodo,
	createTodo,
	updateTodo,
	deleteTodo,
	toggleTodo,
	reorderTodos,
	getTodoStats,
	bulkUpdateTodos,
};
