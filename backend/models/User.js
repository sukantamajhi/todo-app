const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, "Please add a name"],
		trim: true,
		maxlength: [50, "Name cannot be more than 50 characters"],
	},
	email: {
		type: String,
		required: [true, "Please add an email"],
		unique: true,
		lowercase: true,
		match: [
			/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
			"Please add a valid email",
		],
	},
	password: {
		type: String,
		required: [true, "Please add a password"],
		minlength: 6,
		select: false,
	},
	avatar: {
		type: String,
		default: "",
	},
	preferences: {
		theme: {
			type: String,
			enum: ["light", "dark"],
			default: "light",
		},
		defaultView: {
			type: String,
			enum: ["list", "grid", "calendar"],
			default: "list",
		},
		notifications: {
			type: Boolean,
			default: true,
		},
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
	lastLoginAt: {
		type: Date,
	},
});

// Encrypt password using bcrypt
userSchema.pre("save", async function (next) {
	if (!this.isModified("password")) {
		next();
	}

	const salt = await bcrypt.genSalt(
		parseInt(process.env.BCRYPT_SALT_ROUNDS) || 10
	);
	this.password = await bcrypt.hash(this.password, salt);
});

// Sign JWT and return
userSchema.methods.getSignedJwtToken = function () {
	return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRE,
	});
};

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
	return await bcrypt.compare(enteredPassword, this.password);
};

// Update last login
userSchema.methods.updateLastLogin = function () {
	this.lastLoginAt = new Date();
	return this.save({ validateBeforeSave: false });
};

module.exports = mongoose.model("User", userSchema);
