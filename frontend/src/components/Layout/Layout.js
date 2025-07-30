import React, { useState } from "react";
import {
	Box,
	Drawer,
	AppBar,
	Toolbar,
	Typography,
	IconButton,
	Avatar,
	Menu,
	MenuItem,
	useTheme,
	useMediaQuery,
} from "@mui/material";
import {
	Menu as MenuIcon,
	Brightness4,
	Brightness7,
	AccountCircle,
	Logout,
	Settings,
} from "@mui/icons-material";

import { useAuth } from "../../contexts/AuthContext";
import { useTheme as useCustomTheme } from "../../contexts/ThemeContext";
import Sidebar from "./Sidebar";

const drawerWidth = 280;

const Layout = ({ children }) => {
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down("md"));
	const [mobileOpen, setMobileOpen] = useState(false);
	const [anchorEl, setAnchorEl] = useState(null);

	const { user, logout } = useAuth();
	const { isDark, toggleTheme } = useCustomTheme();

	const handleDrawerToggle = () => {
		setMobileOpen(!mobileOpen);
	};

	const handleProfileMenuOpen = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handleProfileMenuClose = () => {
		setAnchorEl(null);
	};

	const handleLogout = () => {
		handleProfileMenuClose();
		logout();
	};

	return (
		<Box sx={{ display: "flex" }}>
			{/* App Bar */}
			<AppBar
				position='fixed'
				sx={{
					width: { md: `calc(100% - ${drawerWidth}px)` },
					ml: { md: `${drawerWidth}px` },
					bgcolor: "background.paper",
					color: "text.primary",
					boxShadow: 1,
				}}>
				<Toolbar>
					<IconButton
						color='inherit'
						aria-label='open drawer'
						edge='start'
						onClick={handleDrawerToggle}
						sx={{ mr: 2, display: { md: "none" } }}>
						<MenuIcon />
					</IconButton>

					<Typography
						variant='h6'
						noWrap
						component='div'
						sx={{ flexGrow: 1 }}>
						Welcome back, {user?.name}!
					</Typography>

					{/* Theme Toggle */}
					<IconButton onClick={toggleTheme} color='inherit'>
						{isDark ? <Brightness7 /> : <Brightness4 />}
					</IconButton>

					{/* Profile Menu */}
					<IconButton
						size='large'
						edge='end'
						aria-label='account of current user'
						aria-haspopup='true'
						onClick={handleProfileMenuOpen}
						color='inherit'>
						<Avatar
							alt={user?.name}
							src={user?.avatar}
							sx={{ width: 32, height: 32 }}>
							{user?.name?.charAt(0).toUpperCase()}
						</Avatar>
					</IconButton>

					<Menu
						anchorEl={anchorEl}
						open={Boolean(anchorEl)}
						onClose={handleProfileMenuClose}
						onClick={handleProfileMenuClose}
						PaperProps={{
							elevation: 0,
							sx: {
								overflow: "visible",
								filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
								mt: 1.5,
								"& .MuiAvatar-root": {
									width: 32,
									height: 32,
									ml: -0.5,
									mr: 1,
								},
								"&:before": {
									content: '""',
									display: "block",
									position: "absolute",
									top: 0,
									right: 14,
									width: 10,
									height: 10,
									bgcolor: "background.paper",
									transform: "translateY(-50%) rotate(45deg)",
									zIndex: 0,
								},
							},
						}}
						transformOrigin={{
							horizontal: "right",
							vertical: "top",
						}}
						anchorOrigin={{
							horizontal: "right",
							vertical: "bottom",
						}}>
						<MenuItem onClick={handleProfileMenuClose}>
							<AccountCircle sx={{ mr: 1 }} />
							Profile
						</MenuItem>
						<MenuItem onClick={handleProfileMenuClose}>
							<Settings sx={{ mr: 1 }} />
							Settings
						</MenuItem>
						<MenuItem onClick={handleLogout}>
							<Logout sx={{ mr: 1 }} />
							Logout
						</MenuItem>
					</Menu>
				</Toolbar>
			</AppBar>

			{/* Sidebar */}
			<Box
				component='nav'
				sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}>
				{/* Mobile drawer */}
				<Drawer
					variant='temporary'
					open={mobileOpen}
					onClose={handleDrawerToggle}
					ModalProps={{
						keepMounted: true, // Better open performance on mobile.
					}}
					sx={{
						display: { xs: "block", md: "none" },
						"& .MuiDrawer-paper": {
							boxSizing: "border-box",
							width: drawerWidth,
						},
					}}>
					<Sidebar onItemClick={() => setMobileOpen(false)} />
				</Drawer>

				{/* Desktop drawer */}
				<Drawer
					variant='permanent'
					sx={{
						display: { xs: "none", md: "block" },
						"& .MuiDrawer-paper": {
							boxSizing: "border-box",
							width: drawerWidth,
						},
					}}
					open>
					<Sidebar />
				</Drawer>
			</Box>

			{/* Main content */}
			<Box
				component='main'
				sx={{
					flexGrow: 1,
					p: 3,
					width: { md: `calc(100% - ${drawerWidth}px)` },
					mt: 8, // Account for AppBar height
					minHeight: "calc(100vh - 64px)",
					bgcolor: "background.default",
				}}>
				{children}
			</Box>
		</Box>
	);
};

export default Layout;
