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
						main: isDark ? "#8B5CF6" : "#7C3AED", // Rich purple
						light: isDark ? "#A78BFA" : "#8B5CF6",
						dark: isDark ? "#7C3AED" : "#5B21B6",
						contrastText: "#ffffff",
					},
					secondary: {
						main: isDark ? "#06B6D4" : "#0891B2", // Rich cyan
						light: isDark ? "#22D3EE" : "#06B6D4",
						dark: isDark ? "#0891B2" : "#0E7490",
						contrastText: "#ffffff",
					},
					error: {
						main: isDark ? "#F87171" : "#DC2626", // Rich red
						light: isDark ? "#FCA5A5" : "#F87171",
						dark: isDark ? "#DC2626" : "#991B1B",
					},
					warning: {
						main: isDark ? "#FBBF24" : "#D97706", // Rich amber
						light: isDark ? "#FCD34D" : "#FBBF24",
						dark: isDark ? "#D97706" : "#92400E",
					},
					info: {
						main: isDark ? "#3B82F6" : "#2563EB", // Rich blue
						light: isDark ? "#60A5FA" : "#3B82F6",
						dark: isDark ? "#2563EB" : "#1D4ED8",
					},
					success: {
						main: isDark ? "#10B981" : "#059669", // Rich emerald
						light: isDark ? "#34D399" : "#10B981",
						dark: isDark ? "#059669" : "#047857",
					},
					background: {
						default: isDark
							? "linear-gradient(135deg, #0F0F23 0%, #1A1A2E 50%, #16213E 100%)"
							: "linear-gradient(135deg, #FAFBFF 0%, #F3F4F6 50%, #E5E7EB 100%)",
						paper: isDark
							? "linear-gradient(145deg, #1E1E3F 0%, #252547 100%)"
							: "linear-gradient(145deg, #FFFFFF 0%, #F9FAFB 100%)",
					},
					text: {
						primary: isDark ? "#F8FAFC" : "#111827",
						secondary: isDark ? "#CBD5E1" : "#6B7280",
					},
					// Custom gradient colors for modern UI
					gradient: {
						primary: isDark
							? "linear-gradient(135deg, #8B5CF6 0%, #06B6D4 100%)"
							: "linear-gradient(135deg, #7C3AED 0%, #0891B2 100%)",
						secondary: isDark
							? "linear-gradient(135deg, #F59E0B 0%, #EF4444 100%)"
							: "linear-gradient(135deg, #D97706 0%, #DC2626 100%)",
						success: isDark
							? "linear-gradient(135deg, #10B981 0%, #3B82F6 100%)"
							: "linear-gradient(135deg, #059669 0%, #2563EB 100%)",
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
								borderRadius: 12,
								padding: "10px 20px",
								fontWeight: 600,
								boxShadow: isDark
									? "0 4px 14px 0 rgba(139, 92, 246, 0.2)"
									: "0 4px 14px 0 rgba(124, 58, 237, 0.15)",
								transition:
									"all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
								"&:hover": {
									transform: "translateY(-2px)",
									boxShadow: isDark
										? "0 8px 25px 0 rgba(139, 92, 246, 0.3)"
										: "0 8px 25px 0 rgba(124, 58, 237, 0.25)",
								},
							},
							contained: {
								background: isDark
									? "linear-gradient(135deg, #8B5CF6 0%, #06B6D4 100%)"
									: "linear-gradient(135deg, #7C3AED 0%, #0891B2 100%)",
								color: "#ffffff",
								border: "none",
							},
							outlined: {
								borderWidth: "2px",
								borderColor: isDark ? "#8B5CF6" : "#7C3AED",
								"&:hover": {
									borderWidth: "2px",
									backgroundColor: isDark
										? "rgba(139, 92, 246, 0.1)"
										: "rgba(124, 58, 237, 0.1)",
								},
							},
						},
					},
					MuiCard: {
						styleOverrides: {
							root: {
								background: isDark
									? "linear-gradient(145deg, #1E1E3F 0%, #252547 100%)"
									: "linear-gradient(145deg, #FFFFFF 0%, #F9FAFB 100%)",
								boxShadow: isDark
									? "0 10px 25px -5px rgba(0, 0, 0, 0.4), 0 4px 6px -2px rgba(0, 0, 0, 0.05)"
									: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
								borderRadius: 16,
								border: isDark
									? "1px solid rgba(139, 92, 246, 0.2)"
									: "1px solid rgba(124, 58, 237, 0.1)",
								transition:
									"all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
								"&:hover": {
									transform: "translateY(-4px)",
									boxShadow: isDark
										? "0 20px 40px -10px rgba(0, 0, 0, 0.5), 0 8px 16px -4px rgba(139, 92, 246, 0.3)"
										: "0 20px 40px -10px rgba(0, 0, 0, 0.15), 0 8px 16px -4px rgba(124, 58, 237, 0.2)",
								},
							},
						},
					},
					MuiPaper: {
						styleOverrides: {
							root: {
								background: isDark
									? "linear-gradient(145deg, #1E1E3F 0%, #252547 100%)"
									: "linear-gradient(145deg, #FFFFFF 0%, #F9FAFB 100%)",
								border: isDark
									? "1px solid rgba(139, 92, 246, 0.15)"
									: "1px solid rgba(124, 58, 237, 0.1)",
							},
						},
					},
					MuiTextField: {
						styleOverrides: {
							root: {
								"& .MuiOutlinedInput-root": {
									borderRadius: 12,
									backgroundColor: isDark
										? "rgba(30, 30, 63, 0.5)"
										: "rgba(255, 255, 255, 0.8)",
									"& fieldset": {
										borderColor: isDark
											? "rgba(139, 92, 246, 0.3)"
											: "rgba(124, 58, 237, 0.2)",
										borderWidth: "2px",
									},
									"&:hover fieldset": {
										borderColor: isDark
											? "rgba(139, 92, 246, 0.5)"
											: "rgba(124, 58, 237, 0.4)",
									},
									"&.Mui-focused fieldset": {
										borderColor: isDark
											? "#8B5CF6"
											: "#7C3AED",
									},
								},
							},
						},
					},
					MuiChip: {
						styleOverrides: {
							root: {
								borderRadius: 20,
								fontWeight: 600,
								boxShadow: isDark
									? "0 2px 8px rgba(0, 0, 0, 0.2)"
									: "0 2px 8px rgba(0, 0, 0, 0.1)",
							},
							colorPrimary: {
								background: isDark
									? "linear-gradient(135deg, #8B5CF6 0%, #06B6D4 100%)"
									: "linear-gradient(135deg, #7C3AED 0%, #0891B2 100%)",
								color: "#ffffff",
							},
						},
					},
					MuiFab: {
						styleOverrides: {
							root: {
								background: isDark
									? "linear-gradient(135deg, #8B5CF6 0%, #06B6D4 100%)"
									: "linear-gradient(135deg, #7C3AED 0%, #0891B2 100%)",
								boxShadow: isDark
									? "0 8px 25px rgba(139, 92, 246, 0.4)"
									: "0 8px 25px rgba(124, 58, 237, 0.3)",
								"&:hover": {
									transform: "scale(1.1)",
									boxShadow: isDark
										? "0 12px 35px rgba(139, 92, 246, 0.5)"
										: "0 12px 35px rgba(124, 58, 237, 0.4)",
								},
							},
						},
					},
					MuiAppBar: {
						styleOverrides: {
							root: {
								background: isDark
									? "linear-gradient(145deg, #1E1E3F 0%, #252547 100%)"
									: "linear-gradient(145deg, #FFFFFF 0%, #F9FAFB 100%)",
								backdropFilter: "blur(20px)",
								borderBottom: isDark
									? "1px solid rgba(139, 92, 246, 0.2)"
									: "1px solid rgba(124, 58, 237, 0.1)",
							},
						},
					},
					MuiDrawer: {
						styleOverrides: {
							paper: {
								background: isDark
									? "linear-gradient(180deg, #1E1E3F 0%, #252547 100%)"
									: "linear-gradient(180deg, #FFFFFF 0%, #F9FAFB 100%)",
								borderRight: isDark
									? "1px solid rgba(139, 92, 246, 0.2)"
									: "1px solid rgba(124, 58, 237, 0.1)",
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
