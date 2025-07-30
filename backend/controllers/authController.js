const User = require("../models/User");

// Send token response
const sendTokenResponse = (user, statusCode, res) => {
	const token = user.getSignedJwtToken();

	const options = {
		expires: new Date(
			Date.now() +
				parseInt(process.env.JWT_COOKIE_EXPIRE || 30) *
					24 *
					60 *
					60 *
					1000
		),
		httpOnly: true,
	};

	if (process.env.NODE_ENV === "production") {
		options.secure = true;
	}

	res.status(statusCode)
		.cookie("token", token, options)
		.json({
			success: true,
			token,
			user: {
				id: user._id,
				name: user.name,
				email: user.email,
				avatar: user.avatar,
				preferences: user.preferences,
				createdAt: user.createdAt,
				lastLoginAt: user.lastLoginAt,
			},
		});
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res, next) => {
	try {
		const { name, email, password } = req.body;

		// Check if user already exists
		const existingUser = await User.findOne({ email });
		if (existingUser) {
			return res.status(400).json({
				success: false,
				message: "User already exists with this email",
			});
		}

		// Create user
		const user = await User.create({
			name,
			email,
			password,
		});

		sendTokenResponse(user, 201, res);
	} catch (error) {
		next(error);
	}
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res, next) => {
	try {
		const { email, password } = req.body;

		// Find user with password field
		const user = await User.findOne({ email }).select("+password");

		if (!user) {
			return res.status(401).json({
				success: false,
				message: "Invalid credentials",
			});
		}

		// Check if password matches
		const isMatch = await user.matchPassword(password);

		if (!isMatch) {
			return res.status(401).json({
				success: false,
				message: "Invalid credentials",
			});
		}

		// Update last login
		await user.updateLastLogin();

		sendTokenResponse(user, 200, res);
	} catch (error) {
		next(error);
	}
};

// @desc    Log user out / clear cookie
// @route   GET /api/auth/logout
// @access  Private
const logout = async (req, res, next) => {
	res.cookie("token", "none", {
		expires: new Date(Date.now() + 10 * 1000),
		httpOnly: true,
	});

	res.status(200).json({
		success: true,
		message: "Logged out successfully",
	});
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res, next) => {
	try {
		const user = await User.findById(req.user.id);

		res.status(200).json({
			success: true,
			user: {
				id: user._id,
				name: user.name,
				email: user.email,
				avatar: user.avatar,
				preferences: user.preferences,
				createdAt: user.createdAt,
				lastLoginAt: user.lastLoginAt,
			},
		});
	} catch (error) {
		next(error);
	}
};

// @desc    Update user details
// @route   PUT /api/auth/updatedetails
// @access  Private
const updateDetails = async (req, res, next) => {
	try {
		const fieldsToUpdate = {
			name: req.body.name,
			email: req.body.email,
		};

		const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
			new: true,
			runValidators: true,
		});

		res.status(200).json({
			success: true,
			user: {
				id: user._id,
				name: user.name,
				email: user.email,
				avatar: user.avatar,
				preferences: user.preferences,
				createdAt: user.createdAt,
				lastLoginAt: user.lastLoginAt,
			},
		});
	} catch (error) {
		next(error);
	}
};

// @desc    Update user preferences
// @route   PUT /api/auth/preferences
// @access  Private
const updatePreferences = async (req, res, next) => {
	try {
		const { theme, defaultView, notifications } = req.body;

		const user = await User.findByIdAndUpdate(
			req.user.id,
			{
				$set: {
					"preferences.theme": theme,
					"preferences.defaultView": defaultView,
					"preferences.notifications": notifications,
				},
			},
			{
				new: true,
				runValidators: true,
			}
		);

		res.status(200).json({
			success: true,
			user: {
				id: user._id,
				name: user.name,
				email: user.email,
				avatar: user.avatar,
				preferences: user.preferences,
				createdAt: user.createdAt,
				lastLoginAt: user.lastLoginAt,
			},
		});
	} catch (error) {
		next(error);
	}
};

module.exports = {
	register,
	login,
	logout,
	getMe,
	updateDetails,
	updatePreferences,
};
