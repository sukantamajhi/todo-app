import React, { createContext, useContext, useMemo, useEffect } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useAuth } from "./AuthContext";

const ThemeContext = createContext();

export const useTheme = () => {
	const context = useContext(ThemeContext);
	if (!context) {
		throw new Error("useTheme must be used within a ThemeContextProvider");
	}
	return context;
};

export const ThemeContextProvider = ({ children }) => {
	const { user, updatePreferences } = useAuth();

	// Use user preference if available, otherwise fall back to localStorage, then system preference
	const isDark = user?.preferences?.theme
		? user.preferences.theme === "dark"
		: localStorage.getItem("theme") === "dark" ||
		  (!localStorage.getItem("theme") &&
				window.matchMedia("(prefers-color-scheme: dark)").matches);

	// Sync user's theme preference to localStorage when user data loads
	useEffect(() => {
		if (user?.preferences?.theme) {
			localStorage.setItem("theme", user.preferences.theme);
		}
	}, [user?.preferences?.theme]);

	const theme = useMemo(
		() =>
			createTheme({
				palette: {
					mode: isDark ? "dark" : "light",
					primary: {
						main: "#2196F3",
						light: "#64B5F6",
						dark: "#1976D2",
					},
					secondary: {
						main: "#FF9800",
						light: "#FFB74D",
						dark: "#F57C00",
					},
					error: {
						main: "#F44336",
						light: "#EF5350",
						dark: "#D32F2F",
					},
					warning: {
						main: "#FF9800",
						light: "#FFB74D",
						dark: "#F57C00",
					},
					info: {
						main: "#2196F3",
						light: "#64B5F6",
						dark: "#1976D2",
					},
					success: {
						main: "#4CAF50",
						light: "#81C784",
						dark: "#388E3C",
					},
					background: {
						default: isDark ? "#121212" : "#fafafa",
						paper: isDark ? "#1e1e1e" : "#ffffff",
					},
					text: {
						primary: isDark ? "#ffffff" : "rgba(0, 0, 0, 0.87)",
						secondary: isDark
							? "rgba(255, 255, 255, 0.7)"
							: "rgba(0, 0, 0, 0.6)",
					},
				},
				typography: {
					fontFamily: [
						"Inter",
						"-apple-system",
						"BlinkMacSystemFont",
						'"Segoe UI"',
						"Roboto",
						'"Helvetica Neue"',
						"Arial",
						"sans-serif",
					].join(","),
					h4: {
						fontWeight: 600,
					},
					h5: {
						fontWeight: 600,
					},
					h6: {
						fontWeight: 600,
					},
					button: {
						fontWeight: 500,
						textTransform: "none",
					},
				},
				shape: {
					borderRadius: 8,
				},
				components: {
					MuiButton: {
						styleOverrides: {
							root: {
								borderRadius: 8,
								padding: "8px 16px",
								fontWeight: 500,
							},
						},
					},
					MuiCard: {
						styleOverrides: {
							root: {
								boxShadow: isDark
									? "0 2px 8px rgba(0, 0, 0, 0.3)"
									: "0 2px 8px rgba(0, 0, 0, 0.1)",
								borderRadius: 12,
							},
						},
					},
					MuiPaper: {
						styleOverrides: {
							root: {
								borderRadius: 8,
							},
						},
					},
					MuiTextField: {
						styleOverrides: {
							root: {
								"& .MuiOutlinedInput-root": {
									borderRadius: 8,
								},
							},
						},
					},
					MuiChip: {
						styleOverrides: {
							root: {
								borderRadius: 16,
							},
						},
					},
				},
			}),
		[isDark]
	);

	const toggleTheme = () => {
		const newTheme = isDark ? "light" : "dark";

		// Always save to localStorage for immediate persistence
		localStorage.setItem("theme", newTheme);

		// Also update user preferences if user is logged in
		if (user && updatePreferences) {
			updatePreferences({
				...user.preferences,
				theme: newTheme,
			});
		}
	};

	const value = {
		theme,
		isDark,
		toggleTheme,
	};

	return (
		<ThemeContext.Provider value={value}>
			<ThemeProvider theme={theme}>{children}</ThemeProvider>
		</ThemeContext.Provider>
	);
};
