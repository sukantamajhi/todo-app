import React, { createContext, useContext, useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import authAPI from "../services/authAPI";

const AuthContext = createContext();

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
};

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [token, setToken] = useState(localStorage.getItem("token"));
	const queryClient = useQueryClient();

	// Get current user
	const { isLoading: loading } = useQuery("me", authAPI.getMe, {
		enabled: !!token,
		onSuccess: (data) => {
			setUser(data.user);
		},
		onError: () => {
			logout();
		},
		retry: false,
	});

	// Login mutation
	const loginMutation = useMutation(authAPI.login, {
		onSuccess: (data) => {
			const { token: newToken, user: newUser } = data;
			setToken(newToken);
			setUser(newUser);
			localStorage.setItem("token", newToken);
			queryClient.setQueryData("me", data);
			toast.success(`Welcome back, ${newUser.name}!`);
		},
		onError: (error) => {
			toast.error(error.response?.data?.message || "Login failed");
		},
	});

	// Register mutation
	const registerMutation = useMutation(authAPI.register, {
		onSuccess: (data) => {
			const { token: newToken, user: newUser } = data;
			setToken(newToken);
			setUser(newUser);
			localStorage.setItem("token", newToken);
			queryClient.setQueryData("me", data);
			toast.success(`Welcome, ${newUser.name}!`);
		},
		onError: (error) => {
			toast.error(error.response?.data?.message || "Registration failed");
		},
	});

	// Update user details mutation
	const updateUserMutation = useMutation(authAPI.updateDetails, {
		onSuccess: (data) => {
			setUser(data.user);
			queryClient.setQueryData("me", data);
			toast.success("Profile updated successfully");
		},
		onError: (error) => {
			toast.error(error.response?.data?.message || "Update failed");
		},
	});

	// Update preferences mutation
	const updatePreferencesMutation = useMutation(authAPI.updatePreferences, {
		onSuccess: (data) => {
			setUser(data.user);
			queryClient.setQueryData("me", data);
			toast.success("Preferences updated successfully");
		},
		onError: (error) => {
			toast.error(error.response?.data?.message || "Update failed");
		},
	});

	const login = (credentials) => {
		return loginMutation.mutateAsync(credentials);
	};

	const register = (userData) => {
		return registerMutation.mutateAsync(userData);
	};

	const logout = () => {
		setUser(null);
		setToken(null);
		localStorage.removeItem("token");
		queryClient.clear();
		toast.info("Logged out successfully");
	};

	const updateUser = (userData) => {
		return updateUserMutation.mutateAsync(userData);
	};

	const updatePreferences = (preferences) => {
		return updatePreferencesMutation.mutateAsync(preferences);
	};

	// Set up axios interceptor for token
	useEffect(() => {
		if (token) {
			authAPI.setAuthToken(token);
		} else {
			authAPI.removeAuthToken();
		}
	}, [token]);

	const value = {
		user,
		token,
		loading,
		login,
		register,
		logout,
		updateUser,
		updatePreferences,
		isLoggingIn: loginMutation.isLoading,
		isRegistering: registerMutation.isLoading,
		isUpdating:
			updateUserMutation.isLoading || updatePreferencesMutation.isLoading,
	};

	return (
		<AuthContext.Provider value={value}>{children}</AuthContext.Provider>
	);
};
