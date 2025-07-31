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
import ComponentHighlighter from "./components/DevTools/ComponentHighlighter";

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
					background:
						theme.palette.mode === "dark"
							? "linear-gradient(135deg, #0F0F23 0%, #1A1A2E 50%, #16213E 100%)"
							: "linear-gradient(135deg, #FAFBFF 0%, #F3F4F6 50%, #E5E7EB 100%)",
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
			<ComponentHighlighter />
		</Layout>
	);
}

export default App;
