import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
	Box,
	List,
	ListItem,
	ListItemButton,
	ListItemIcon,
	ListItemText,
	Toolbar,
	Typography,
	Divider,
	Chip,
} from "@mui/material";
import {
	Dashboard,
	CheckBox,
	Category,
	Person,
	Assignment,
} from "@mui/icons-material";
import { useQuery } from "react-query";
import todoAPI from "../../services/todoAPI";

const menuItems = [
	{
		text: "Dashboard",
		icon: <Dashboard />,
		path: "/dashboard",
	},
	{
		text: "All Todos",
		icon: <CheckBox />,
		path: "/todos",
	},
	{
		text: "Categories",
		icon: <Category />,
		path: "/categories",
	},
	{
		text: "Profile",
		icon: <Person />,
		path: "/profile",
	},
];

const Sidebar = ({ onItemClick }) => {
	const location = useLocation();
	const navigate = useNavigate();

	// Get todo stats for sidebar badges
	const { data: stats } = useQuery("todoStats", todoAPI.getTodoStats, {
		refetchInterval: 30000, // Refetch every 30 seconds
	});

	const handleItemClick = (path) => {
		navigate(path);
		onItemClick?.();
	};

	const getItemBadge = (path) => {
		if (!stats?.data) return null;

		switch (path) {
			case "/todos":
				return stats.data.pending > 0 ? (
					<Chip
						label={stats.data.pending}
						size='small'
						color='primary'
						sx={{ ml: 1 }}
					/>
				) : null;
			case "/dashboard":
				return stats.data.overdue > 0 ? (
					<Chip
						label={stats.data.overdue}
						size='small'
						color='error'
						sx={{ ml: 1 }}
					/>
				) : null;
			default:
				return null;
		}
	};

	return (
		<Box>
			{/* Logo/Title */}
			<Toolbar>
				<Box
					sx={{
						background:
							"linear-gradient(135deg, #8B5CF6 0%, #06B6D4 100%)",
						borderRadius: 2,
						p: 1,
						mr: 2,
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
					}}>
					<Assignment sx={{ color: "#ffffff", fontSize: 24 }} />
				</Box>
				<Typography
					variant='h6'
					noWrap
					component='div'
					sx={{
						fontWeight: 700,
						background:
							"linear-gradient(135deg, #8B5CF6 0%, #06B6D4 100%)",
						WebkitBackgroundClip: "text",
						WebkitTextFillColor: "transparent",
						backgroundClip: "text",
					}}>
					Todo App
				</Typography>
			</Toolbar>

			<Divider sx={{ borderColor: "rgba(139, 92, 246, 0.1)" }} />

			{/* Quick Stats */}
			{stats?.data && (
				<Box sx={{ p: 2 }}>
					<Typography
						variant='subtitle2'
						color='text.secondary'
						gutterBottom>
						Quick Stats
					</Typography>
					<Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
						<Chip
							label={`${stats.data.completed} Completed`}
							size='small'
							color='success'
							variant='outlined'
						/>
						<Chip
							label={`${stats.data.pending} Pending`}
							size='small'
							color='primary'
							variant='outlined'
						/>
						{stats.data.overdue > 0 && (
							<Chip
								label={`${stats.data.overdue} Overdue`}
								size='small'
								color='error'
								variant='outlined'
							/>
						)}
					</Box>
				</Box>
			)}

			<Divider sx={{ borderColor: "rgba(139, 92, 246, 0.1)" }} />

			{/* Navigation Menu */}
			<List sx={{ px: 2 }}>
				{menuItems.map((item) => (
					<ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
						<ListItemButton
							selected={location.pathname === item.path}
							onClick={() => handleItemClick(item.path)}
							sx={{
								borderRadius: 2,
								transition:
									"all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
								"&.Mui-selected": {
									background:
										"linear-gradient(135deg, #8B5CF6 0%, #06B6D4 100%)",
									color: "#ffffff",
									boxShadow:
										"0 4px 14px rgba(139, 92, 246, 0.3)",
									"&:hover": {
										background:
											"linear-gradient(135deg, #7C3AED 0%, #0891B2 100%)",
										transform: "translateY(-1px)",
										boxShadow:
											"0 6px 20px rgba(139, 92, 246, 0.4)",
									},
									"& .MuiListItemIcon-root": {
										color: "#ffffff",
									},
								},
								"&:hover": {
									backgroundColor: "rgba(139, 92, 246, 0.1)",
									transform: "translateX(4px)",
								},
							}}>
							<ListItemIcon
								sx={{
									color:
										location.pathname === item.path
											? "inherit"
											: "text.secondary",
								}}>
								{item.icon}
							</ListItemIcon>
							<ListItemText
								primary={item.text}
								sx={{ flex: 1 }}
							/>
							{getItemBadge(item.path)}
						</ListItemButton>
					</ListItem>
				))}
			</List>
		</Box>
	);
};

export default Sidebar;
