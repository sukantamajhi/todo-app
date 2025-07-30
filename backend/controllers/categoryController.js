const Category = require("../models/Category");
const Todo = require("../models/Todo");

// @desc    Get all categories for a user
// @route   GET /api/categories
// @access  Private
const getCategories = async (req, res, next) => {
	try {
		const categories = await Category.find({ user: req.user.id }).sort({
			isDefault: -1,
			createdAt: 1,
		});

		// Get todo count for each category
		const categoriesWithCount = await Promise.all(
			categories.map(async (category) => {
				const todoCount = await Todo.countDocuments({
					user: req.user.id,
					category: category._id,
				});

				return {
					...category.toObject(),
					todoCount,
				};
			})
		);

		res.status(200).json({
			success: true,
			data: categoriesWithCount,
		});
	} catch (error) {
		next(error);
	}
};

// @desc    Get single category
// @route   GET /api/categories/:id
// @access  Private
const getCategory = async (req, res, next) => {
	try {
		const category = await Category.findOne({
			_id: req.params.id,
			user: req.user.id,
		});

		if (!category) {
			return res.status(404).json({
				success: false,
				message: "Category not found",
			});
		}

		// Get todo count for this category
		const todoCount = await Todo.countDocuments({
			user: req.user.id,
			category: category._id,
		});

		res.status(200).json({
			success: true,
			data: {
				...category.toObject(),
				todoCount,
			},
		});
	} catch (error) {
		next(error);
	}
};

// @desc    Create new category
// @route   POST /api/categories
// @access  Private
const createCategory = async (req, res, next) => {
	try {
		// Add user to req.body
		req.body.user = req.user.id;

		const category = await Category.create(req.body);

		res.status(201).json({
			success: true,
			data: {
				...category.toObject(),
				todoCount: 0,
			},
		});
	} catch (error) {
		next(error);
	}
};

// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Private
const updateCategory = async (req, res, next) => {
	try {
		let category = await Category.findOne({
			_id: req.params.id,
			user: req.user.id,
		});

		if (!category) {
			return res.status(404).json({
				success: false,
				message: "Category not found",
			});
		}

		// Prevent updating default category name
		if (category.isDefault && req.body.name) {
			return res.status(400).json({
				success: false,
				message: "Cannot change name of default category",
			});
		}

		category = await Category.findByIdAndUpdate(req.params.id, req.body, {
			new: true,
			runValidators: true,
		});

		// Get todo count for this category
		const todoCount = await Todo.countDocuments({
			user: req.user.id,
			category: category._id,
		});

		res.status(200).json({
			success: true,
			data: {
				...category.toObject(),
				todoCount,
			},
		});
	} catch (error) {
		next(error);
	}
};

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Private
const deleteCategory = async (req, res, next) => {
	try {
		const category = await Category.findOne({
			_id: req.params.id,
			user: req.user.id,
		});

		if (!category) {
			return res.status(404).json({
				success: false,
				message: "Category not found",
			});
		}

		// Prevent deleting default category
		if (category.isDefault) {
			return res.status(400).json({
				success: false,
				message: "Cannot delete default category",
			});
		}

		// Check if category has todos
		const todoCount = await Todo.countDocuments({
			user: req.user.id,
			category: category._id,
		});

		if (todoCount > 0) {
			// Option 1: Prevent deletion if category has todos
			return res.status(400).json({
				success: false,
				message: `Cannot delete category. It contains ${todoCount} todo(s). Please move or delete the todos first.`,
			});

			// Option 2: Move todos to default category (uncomment below and comment above)
			/*
      const defaultCategory = await Category.findOne({
        user: req.user.id,
        isDefault: true
      });
      
      if (defaultCategory) {
        await Todo.updateMany(
          { user: req.user.id, category: category._id },
          { category: defaultCategory._id }
        );
      } else {
        await Todo.updateMany(
          { user: req.user.id, category: category._id },
          { $unset: { category: 1 } }
        );
      }
      */
		}

		await category.deleteOne();

		res.status(200).json({
			success: true,
			message: "Category deleted successfully",
		});
	} catch (error) {
		next(error);
	}
};

// @desc    Create default categories for a new user
// @route   POST /api/categories/defaults
// @access  Private
const createDefaultCategories = async (req, res, next) => {
	try {
		const userId = req.user.id;

		// Check if user already has default categories
		const existingDefaults = await Category.countDocuments({
			user: userId,
			isDefault: true,
		});

		if (existingDefaults > 0) {
			return res.status(400).json({
				success: false,
				message: "Default categories already exist",
			});
		}

		const defaultCategories = [
			{
				name: "General",
				color: "#2196F3",
				icon: "category",
				description: "General todos",
				user: userId,
				isDefault: true,
			},
			{
				name: "Work",
				color: "#FF9800",
				icon: "work",
				description: "Work-related tasks",
				user: userId,
				isDefault: false,
			},
			{
				name: "Personal",
				color: "#4CAF50",
				icon: "person",
				description: "Personal tasks",
				user: userId,
				isDefault: false,
			},
			{
				name: "Shopping",
				color: "#E91E63",
				icon: "shopping_cart",
				description: "Shopping lists",
				user: userId,
				isDefault: false,
			},
		];

		const categories = await Category.insertMany(defaultCategories);

		res.status(201).json({
			success: true,
			message: "Default categories created successfully",
			data: categories.map((cat) => ({
				...cat.toObject(),
				todoCount: 0,
			})),
		});
	} catch (error) {
		next(error);
	}
};

module.exports = {
	getCategories,
	getCategory,
	createCategory,
	updateCategory,
	deleteCategory,
	createDefaultCategories,
};
