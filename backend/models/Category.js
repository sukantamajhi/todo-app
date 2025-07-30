const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, "Please add a category name"],
		trim: true,
		maxlength: [30, "Category name cannot be more than 30 characters"],
	},
	color: {
		type: String,
		required: [true, "Please add a color"],
		match: [
			/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
			"Please add a valid hex color",
		],
	},
	icon: {
		type: String,
		default: "category",
	},
	description: {
		type: String,
		maxlength: [200, "Description cannot be more than 200 characters"],
	},
	user: {
		type: mongoose.Schema.ObjectId,
		ref: "User",
		required: true,
	},
	isDefault: {
		type: Boolean,
		default: false,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

// Create index for user and name combination
categorySchema.index({ user: 1, name: 1 }, { unique: true });

module.exports = mongoose.model("Category", categorySchema);
