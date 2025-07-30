import React from "react";
import { useNavigate } from "react-router-dom";
import {
	Box,
	Grid,
	Card,
	CardContent,
	Typography,
	LinearProgress,
	Chip,
	List,
	ListItem,
	ListItemText,
	ListItemIcon,
	Button,
	Paper,
} from "@mui/material";
import {
	TrendingUp,
	Assignment,
	CheckCircle,
	Schedule,
	Warning,
	Add,
	CalendarToday,
	Flag,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { useQuery } from "react-query";
import { format, isToday, isTomorrow } from "date-fns";

import todoAPI from "../services/todoAPI";
import { useAuth } from "../contexts/AuthContext";

const Dashboard = () => {
	const { user } = useAuth();
	const navigate = useNavigate();

	// Get todo statistics
	const { data: stats, isLoading: statsLoading } = useQuery(
		"todoStats",
		todoAPI.getTodoStats
	);

	// Get recent todos
	const { data: recentTodos } = useQuery("recentTodos", () =>
		todoAPI.getTodos({ limit: 5, sortBy: "createdAt", sortOrder: "desc" })
	);

	// Get upcoming todos
	const { data: upcomingTodos } = useQuery("upcomingTodos", () =>
		todoAPI.getTodos({
			limit: 5,
			sortBy: "dueDate",
			sortOrder: "asc",
			status: "pending",
		})
	);

	const getPriorityColor = (priority) => {
		switch (priority) {
			case "critical":
				return "error";
			case "high":
				return "warning";
			case "medium":
				return "info";
			case "low":
				return "success";
			default:
				return "default";
		}
	};

	const formatDueDate = (date) => {
		if (!date) return "";
		const dueDate = new Date(date);
		if (isToday(dueDate)) return "Today";
		if (isTomorrow(dueDate)) return "Tomorrow";
		return format(dueDate, "MMM dd");
	};

	const StatCard = ({ title, value, icon, color = "primary", trend }) => (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}>
			<Card>
				<CardContent>
					<Box
						sx={{
							display: "flex",
							alignItems: "center",
							justifyContent: "space-between",
						}}>
						<Box>
							<Typography color='text.secondary' variant='body2'>
								{title}
							</Typography>
							<Typography
								variant='h4'
								component='div'
								sx={{ mt: 1 }}>
								{value}
							</Typography>
							{trend && (
								<Box
									sx={{
										display: "flex",
										alignItems: "center",
										mt: 1,
									}}>
									<TrendingUp
										sx={{
											fontSize: 16,
											mr: 0.5,
											color: "success.main",
										}}
									/>
									<Typography
										variant='body2'
										color='success.main'>
										{trend}
									</Typography>
								</Box>
							)}
						</Box>
						<Box
							sx={{
								bgcolor: `${color}.main`,
								color: `${color}.contrastText`,
								borderRadius: 2,
								p: 1.5,
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
							}}>
							{icon}
						</Box>
					</Box>
				</CardContent>
			</Card>
		</motion.div>
	);

	if (statsLoading) {
		return (
			<Box sx={{ p: 3 }}>
				<Typography variant='h4' gutterBottom>
					Dashboard
				</Typography>
				<LinearProgress />
			</Box>
		);
	}

	const statsData = stats?.data || {};

	return (
		<Box>
			{/* Header */}
			<Box sx={{ mb: 4 }}>
				<Typography variant='h4' gutterBottom>
					Good morning, {user?.name}! 👋
				</Typography>
				<Typography variant='body1' color='text.secondary'>
					Here's what's happening with your todos today.
				</Typography>
			</Box>

			{/* Statistics Cards */}
			<Grid container spacing={3} sx={{ mb: 4 }}>
				<Grid item xs={12} sm={6} md={3}>
					<StatCard
						title='Total Todos'
						value={statsData.total || 0}
						icon={<Assignment />}
						color='primary'
					/>
				</Grid>
				<Grid item xs={12} sm={6} md={3}>
					<StatCard
						title='Completed'
						value={statsData.completed || 0}
						icon={<CheckCircle />}
						color='success'
						trend={`${
							statsData.completionRate || 0
						}% completion rate`}
					/>
				</Grid>
				<Grid item xs={12} sm={6} md={3}>
					<StatCard
						title='Pending'
						value={statsData.pending || 0}
						icon={<Schedule />}
						color='warning'
					/>
				</Grid>
				<Grid item xs={12} sm={6} md={3}>
					<StatCard
						title='Overdue'
						value={statsData.overdue || 0}
						icon={<Warning />}
						color='error'
					/>
				</Grid>
			</Grid>

			{/* Progress Section */}
			{statsData.total > 0 && (
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.2 }}>
					<Card sx={{ mb: 4 }}>
						<CardContent>
							<Typography variant='h6' gutterBottom>
								Overall Progress
							</Typography>
							<Box
								sx={{
									display: "flex",
									alignItems: "center",
									mt: 2,
								}}>
								<Box sx={{ width: "100%", mr: 1 }}>
									<LinearProgress
										variant='determinate'
										value={statsData.completionRate || 0}
										sx={{ height: 10, borderRadius: 5 }}
									/>
								</Box>
								<Box sx={{ minWidth: 35 }}>
									<Typography
										variant='body2'
										color='text.secondary'>
										{statsData.completionRate || 0}%
									</Typography>
								</Box>
							</Box>
							<Typography
								variant='body2'
								color='text.secondary'
								sx={{ mt: 1 }}>
								{statsData.completed} of {statsData.total} todos
								completed
							</Typography>
						</CardContent>
					</Card>
				</motion.div>
			)}

			{/* Main Content Grid */}
			<Grid container spacing={3}>
				{/* Recent Todos */}
				<Grid item xs={12} md={6}>
					<motion.div
						initial={{ opacity: 0, x: -20 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.5, delay: 0.3 }}>
						<Card>
							<CardContent>
								<Box
									sx={{
										display: "flex",
										justifyContent: "space-between",
										alignItems: "center",
										mb: 2,
									}}>
									<Typography variant='h6'>
										Recent Todos
									</Typography>
									<Button
										startIcon={<Add />}
										variant='outlined'
										size='small'
										onClick={() => navigate("/todos")}>
										Add Todo
									</Button>
								</Box>
								{recentTodos?.data?.length > 0 ? (
									<List>
										{recentTodos.data.map((todo) => (
											<ListItem key={todo._id} divider>
												<ListItemIcon>
													<Chip
														label={todo.priority}
														size='small'
														color={getPriorityColor(
															todo.priority
														)}
													/>
												</ListItemIcon>
												<ListItemText
													primary={todo.title}
													secondary={todo.description}
												/>
											</ListItem>
										))}
									</List>
								) : (
									<Typography
										color='text.secondary'
										sx={{ textAlign: "center", py: 3 }}>
										No todos yet. Create your first one!
									</Typography>
								)}
							</CardContent>
						</Card>
					</motion.div>
				</Grid>

				{/* Upcoming Todos */}
				<Grid item xs={12} md={6}>
					<motion.div
						initial={{ opacity: 0, x: 20 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.5, delay: 0.4 }}>
						<Card>
							<CardContent>
								<Typography variant='h6' gutterBottom>
									Upcoming Deadlines
								</Typography>
								{upcomingTodos?.data?.length > 0 ? (
									<List>
										{upcomingTodos.data
											.filter((todo) => todo.dueDate)
											.map((todo) => (
												<ListItem
													key={todo._id}
													divider>
													<ListItemIcon>
														<CalendarToday color='action' />
													</ListItemIcon>
													<ListItemText
														primary={todo.title}
														secondary={
															<Box
																sx={{
																	display:
																		"flex",
																	alignItems:
																		"center",
																	gap: 1,
																	mt: 0.5,
																}}>
																<Chip
																	label={formatDueDate(
																		todo.dueDate
																	)}
																	size='small'
																	color={
																		new Date(
																			todo.dueDate
																		) <
																		new Date()
																			? "error"
																			: "default"
																	}
																/>
																<Chip
																	icon={
																		<Flag />
																	}
																	label={
																		todo.priority
																	}
																	size='small'
																	color={getPriorityColor(
																		todo.priority
																	)}
																/>
															</Box>
														}
													/>
												</ListItem>
											))}
									</List>
								) : (
									<Typography
										color='text.secondary'
										sx={{ textAlign: "center", py: 3 }}>
										No upcoming deadlines
									</Typography>
								)}
							</CardContent>
						</Card>
					</motion.div>
				</Grid>
			</Grid>

			{/* Quick Actions */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5, delay: 0.5 }}>
				<Paper sx={{ p: 3, mt: 4 }}>
					<Typography variant='h6' gutterBottom>
						Quick Actions
					</Typography>
					<Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
						<Button
							variant='contained'
							startIcon={<Add />}
							href='/todos'>
							Create Todo
						</Button>
						<Button
							variant='outlined'
							startIcon={<CheckCircle />}
							href='/todos?status=pending'>
							View Pending
						</Button>
						<Button
							variant='outlined'
							startIcon={<Warning />}
							href='/todos?status=overdue'>
							View Overdue
						</Button>
					</Box>
				</Paper>
			</motion.div>
		</Box>
	);
};

export default Dashboard;
