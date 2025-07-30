import api from "./api";

const authAPI = {
	// Authentication
	login: async (credentials) => {
		const response = await api.post("/auth/login", credentials);
		return response;
	},

	register: async (userData) => {
		const response = await api.post("/auth/register", userData);
		return response;
	},

	logout: async () => {
		const response = await api.get("/auth/logout");
		return response;
	},

	getMe: async () => {
		const response = await api.get("/auth/me");
		return response;
	},

	updateDetails: async (userData) => {
		const response = await api.put("/auth/updatedetails", userData);
		return response;
	},

	updatePreferences: async (preferences) => {
		const response = await api.put("/auth/preferences", preferences);
		return response;
	},

	// Token management
	setAuthToken: (token) => {
		if (token) {
			api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
		} else {
			delete api.defaults.headers.common["Authorization"];
		}
	},

	removeAuthToken: () => {
		delete api.defaults.headers.common["Authorization"];
	},
};

export default authAPI;
