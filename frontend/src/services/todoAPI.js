import api from "./api";

const todoAPI = {
	// Get todos with filtering and pagination
	getTodos: async (params = {}) => {
		const response = await api.get("/todos", { params });
		return response;
	},

	// Get single todo
	getTodo: async (id) => {
		const response = await api.get(`/todos/${id}`);
		return response;
	},

	// Create new todo
	createTodo: async (todoData) => {
		const response = await api.post("/todos", todoData);
		return response;
	},

	// Update todo
	updateTodo: async (id, todoData) => {
		const response = await api.put(`/todos/${id}`, todoData);
		return response;
	},

	// Delete todo
	deleteTodo: async (id) => {
		const response = await api.delete(`/todos/${id}`);
		return response;
	},

	// Toggle todo completion
	toggleTodo: async (id) => {
		const response = await api.patch(`/todos/${id}/toggle`);
		return response;
	},

	// Reorder todos
	reorderTodos: async (todoIds) => {
		const response = await api.patch("/todos/reorder", { todoIds });
		return response;
	},

	// Get todo statistics
	getTodoStats: async () => {
		const response = await api.get("/todos/stats");
		return response;
	},

	// Bulk update todos
	bulkUpdateTodos: async (todoIds, updates) => {
		const response = await api.patch("/todos/bulk", { todoIds, updates });
		return response;
	},
};

export default todoAPI;
