const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const { createServer } = require("http");
const { Server } = require("socket.io");
require("dotenv").config();

const connectDB = require("./config/database");
const authRoutes = require("./routes/auth");
const todoRoutes = require("./routes/todos");
const categoryRoutes = require("./routes/categories");
const errorHandler = require("./middleware/errorHandler");

// Connect to MongoDB
connectDB();

const app = express();
const server = createServer(app);
const io = new Server(server, {
	cors: {
		origin:
			process.env.NODE_ENV === "production"
				? false
				: ["http://localhost:3000"],
		credentials: true,
	},
});

// Security middleware
app.use(helmet());
app.use(
	cors({
		origin:
			process.env.NODE_ENV === "production"
				? false
				: ["http://localhost:3000"],
		credentials: true,
	})
);

// Rate limiting
const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100, // limit each IP to 100 requests per windowMs
	message: "Too many requests from this IP, please try again later.",
});
app.use("/api/", limiter);

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Socket.io middleware for authentication
io.use((socket, next) => {
	const token = socket.handshake.auth.token;
	if (token) {
		// Verify JWT token here if needed
		socket.userId = socket.handshake.auth.userId;
	}
	next();
});

// Socket.io connection handling
io.on("connection", (socket) => {
	console.log(`User ${socket.userId} connected`);

	// Join user to their personal room
	if (socket.userId) {
		socket.join(`user_${socket.userId}`);
	}

	socket.on("disconnect", () => {
		console.log(`User ${socket.userId} disconnected`);
	});
});

// Make io available to routes
app.set("io", io);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/todos", todoRoutes);
app.use("/api/categories", categoryRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
	res.json({
		status: "OK",
		timestamp: new Date().toISOString(),
		environment: process.env.NODE_ENV,
	});
});

// Error handling middleware
app.use(errorHandler);

// Handle undefined routes
app.use("*", (req, res) => {
	res.status(404).json({ message: "Route not found" });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
	console.log(
		`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`
	);
});
