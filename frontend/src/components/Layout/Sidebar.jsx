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
				<Assignment sx={{ mr: 2, color: "primary.main" }} />
				<Typography variant='h6' noWrap component='div'>
					Todo App
				</Typography>
			</Toolbar>

			<Divider />

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

			<Divider />

			{/* Navigation Menu */}
			<List>
				{menuItems.map((item) => (
					<ListItem key={item.text} disablePadding>
						<ListItemButton
							selected={location.pathname === item.path}
							onClick={() => handleItemClick(item.path)}
							sx={{
								"&.Mui-selected": {
									bgcolor: "primary.main",
									color: "primary.contrastText",
									"&:hover": {
										bgcolor: "primary.dark",
									},
									"& .MuiListItemIcon-root": {
										color: "primary.contrastText",
									},
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
