import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Box } from "@mui/material";

import { useAuth } from "./contexts/AuthContext";
import { useTheme } from "./contexts/ThemeContext";
import Layout from "./components/Layout/Layout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import TodoList from "./pages/TodoList";
import Categories from "./pages/Categories";
import Profile from "./pages/Profile";
import LoadingScreen from "./components/UI/LoadingScreen";

function App() {
	const { user, loading } = useAuth();
	const { theme } = useTheme();

	if (loading) {
		return <LoadingScreen />;
	}

	if (!user) {
		return (
			<Box
				sx={{
					minHeight: "100vh",
					background: theme.palette.background.default,
				}}>
				<Routes>
					<Route path='/login' element={<Login />} />
					<Route path='/register' element={<Register />} />
					<Route
						path='*'
						element={<Navigate to='/login' replace />}
					/>
				</Routes>
			</Box>
		);
	}

	return (
		<Layout>
			<Routes>
				<Route
					path='/'
					element={<Navigate to='/dashboard' replace />}
				/>
				<Route path='/dashboard' element={<Dashboard />} />
				<Route path='/todos' element={<TodoList />} />
				<Route path='/categories' element={<Categories />} />
				<Route path='/profile' element={<Profile />} />
				<Route
					path='/login'
					element={<Navigate to='/dashboard' replace />}
				/>
				<Route
					path='/register'
					element={<Navigate to='/dashboard' replace />}
				/>
				<Route
					path='*'
					element={<Navigate to='/dashboard' replace />}
				/>
			</Routes>
		</Layout>
	);
}

export default App;
