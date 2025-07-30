const mongoose = require("mongoose");

const todoSchema = new mongoose.Schema({
	title: {
		type: String,
		required: [true, "Please add a todo title"],
		trim: true,
		maxlength: [100, "Title cannot be more than 100 characters"],
	},
	description: {
		type: String,
		maxlength: [500, "Description cannot be more than 500 characters"],
	},
	completed: {
		type: Boolean,
		default: false,
	},
	priority: {
		type: String,
		enum: ["low", "medium", "high", "critical"],
		default: "medium",
	},
	category: {
		type: mongoose.Schema.ObjectId,
		ref: "Category",
		required: false,
	},
	tags: [
		{
			type: String,
			trim: true,
			maxlength: [20, "Tag cannot be more than 20 characters"],
		},
	],
	dueDate: {
		type: Date,
	},
	reminderDate: {
		type: Date,
	},
	user: {
		type: mongoose.Schema.ObjectId,
		ref: "User",
		required: true,
	},
	position: {
		type: Number,
		default: 0,
	},
	subtasks: [
		{
			title: {
				type: String,
				required: true,
				trim: true,
				maxlength: [
					100,
					"Subtask title cannot be more than 100 characters",
				],
			},
			completed: {
				type: Boolean,
				default: false,
			},
			createdAt: {
				type: Date,
				default: Date.now,
			},
		},
	],
	attachments: [
		{
			filename: String,
			originalName: String,
			mimetype: String,
			size: Number,
			url: String,
			uploadedAt: {
				type: Date,
				default: Date.now,
			},
		},
	],
	progress: {
		type: Number,
		min: 0,
		max: 100,
		default: 0,
	},
	estimatedTime: {
		type: Number, // in minutes
		min: 0,
	},
	actualTime: {
		type: Number, // in minutes
		min: 0,
		default: 0,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
	updatedAt: {
		type: Date,
		default: Date.now,
	},
	completedAt: {
		type: Date,
	},
});

// Update the updatedAt field before saving
todoSchema.pre("save", function (next) {
	this.updatedAt = Date.now();

	// Set completedAt when todo is marked as completed
	if (this.isModified("completed") && this.completed) {
		this.completedAt = new Date();
		this.progress = 100;
	} else if (this.isModified("completed") && !this.completed) {
		this.completedAt = undefined;
	}

	next();
});

// Calculate progress based on subtasks
todoSchema.methods.calculateProgress = function () {
	if (this.subtasks.length === 0) {
		return this.completed ? 100 : 0;
	}

	const completedSubtasks = this.subtasks.filter(
		(subtask) => subtask.completed
	).length;
	return Math.round((completedSubtasks / this.subtasks.length) * 100);
};

// Check if todo is overdue
todoSchema.virtual("isOverdue").get(function () {
	return this.dueDate && this.dueDate < new Date() && !this.completed;
});

// Index for better query performance
todoSchema.index({ user: 1, completed: 1, dueDate: 1 });
todoSchema.index({ user: 1, category: 1 });
todoSchema.index({ user: 1, tags: 1 });
todoSchema.index({ user: 1, position: 1 });

module.exports = mongoose.model("Todo", todoSchema);
