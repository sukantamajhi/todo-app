import React, { useState } from "react";
import {
	Box,
	Card,
	CardContent,
	Typography,
	Button,
	TextField,
	InputAdornment,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	Chip,
	IconButton,
	List,
	ListItem,
	ListItemIcon,
	ListItemText,
	Checkbox,
	Menu,
	Fab,
} from "@mui/material";
import {
	Search,
	Add,
	FilterList,
	MoreVert,
	Edit,
	Delete,
	Flag,
	CalendarToday,
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { format } from "date-fns";
import { toast } from "react-toastify";

import todoAPI from "../services/todoAPI";
import categoryAPI from "../services/categoryAPI";
import TodoDialog from "../components/Todo/TodoDialog";

const TodoList = () => {
	const [searchTerm, setSearchTerm] = useState("");
	const [statusFilter, setStatusFilter] = useState("all");
	const [priorityFilter, setPriorityFilter] = useState("all");
	const [categoryFilter, setCategoryFilter] = useState("all");
	const [page, setPage] = useState(1);
	const [anchorEl, setAnchorEl] = useState(null);
	const [selectedTodo, setSelectedTodo] = useState(null);
	const [todoDialogOpen, setTodoDialogOpen] = useState(false);
	const [editingTodo, setEditingTodo] = useState(null);

	const queryClient = useQueryClient();

	// Build query parameters
	const queryParams = {
		page,
		limit: 20,
		...(searchTerm && { search: searchTerm }),
		...(statusFilter !== "all" && { status: statusFilter }),
		...(priorityFilter !== "all" && { priority: priorityFilter }),
		...(categoryFilter !== "all" && { category: categoryFilter }),
	};

	// Fetch todos
	const {
		data: todosData,
		isLoading,
		error,
	} = useQuery(["todos", queryParams], () => todoAPI.getTodos(queryParams));

	// Fetch categories for filter
	const { data: categoriesData } = useQuery(
		"categories",
		categoryAPI.getCategories
	);

	// Toggle todo mutation
	const toggleTodoMutation = useMutation(todoAPI.toggleTodo, {
		onSuccess: () => {
			queryClient.invalidateQueries("todos");
			queryClient.invalidateQueries("todoStats");
			toast.success("Todo updated successfully");
		},
		onError: (error) => {
			toast.error(
				error.response?.data?.message || "Failed to update todo"
			);
		},
	});

	// Delete todo mutation
	const deleteTodoMutation = useMutation(todoAPI.deleteTodo, {
		onSuccess: () => {
			queryClient.invalidateQueries("todos");
			queryClient.invalidateQueries("todoStats");
			toast.success("Todo deleted successfully");
			setAnchorEl(null);
		},
		onError: (error) => {
			toast.error(
				error.response?.data?.message || "Failed to delete todo"
			);
		},
	});

	const handleToggleTodo = (todoId) => {
		toggleTodoMutation.mutate(todoId);
	};

	const handleDeleteTodo = (todoId) => {
		if (window.confirm("Are you sure you want to delete this todo?")) {
			deleteTodoMutation.mutate(todoId);
		}
	};

	const handleMenuOpen = (event, todo) => {
		setAnchorEl(event.currentTarget);
		setSelectedTodo(todo);
	};

	const handleMenuClose = () => {
		setAnchorEl(null);
		setSelectedTodo(null);
	};

	const handleOpenTodoDialog = (todo = null) => {
		setEditingTodo(todo);
		setTodoDialogOpen(true);
		setAnchorEl(null);
	};

	const handleCloseTodoDialog = () => {
		setTodoDialogOpen(false);
		setEditingTodo(null);
	};

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
		return format(new Date(date), "MMM dd, yyyy");
	};

	const isOverdue = (dueDate, completed) => {
		if (!dueDate || completed) return false;
		return new Date(dueDate) < new Date();
	};

	const todos = todosData?.data || [];
	const categories = categoriesData?.data || [];

	return (
		<Box>
			{/* Header */}
			<Box sx={{ mb: 4 }}>
				<Typography variant='h4' gutterBottom>
					My Todos
				</Typography>
				<Typography variant='body1' color='text.secondary'>
					Manage your tasks and stay organized
				</Typography>
			</Box>

			{/* Filters */}
			<Card sx={{ mb: 3 }}>
				<CardContent>
					<Box
						sx={{
							display: "flex",
							gap: 2,
							flexWrap: "wrap",
							alignItems: "center",
						}}>
						{/* Search */}
						<TextField
							placeholder='Search todos...'
							variant='outlined'
							size='small'
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							InputProps={{
								startAdornment: (
									<InputAdornment position='start'>
										<Search />
									</InputAdornment>
								),
							}}
							sx={{ minWidth: 200 }}
						/>

						{/* Status Filter */}
						<FormControl size='small' sx={{ minWidth: 120 }}>
							<InputLabel>Status</InputLabel>
							<Select
								value={statusFilter}
								onChange={(e) =>
									setStatusFilter(e.target.value)
								}
								label='Status'>
								<MenuItem value='all'>All</MenuItem>
								<MenuItem value='pending'>Pending</MenuItem>
								<MenuItem value='completed'>Completed</MenuItem>
							</Select>
						</FormControl>

						{/* Priority Filter */}
						<FormControl size='small' sx={{ minWidth: 120 }}>
							<InputLabel>Priority</InputLabel>
							<Select
								value={priorityFilter}
								onChange={(e) =>
									setPriorityFilter(e.target.value)
								}
								label='Priority'>
								<MenuItem value='all'>All</MenuItem>
								<MenuItem value='critical'>Critical</MenuItem>
								<MenuItem value='high'>High</MenuItem>
								<MenuItem value='medium'>Medium</MenuItem>
								<MenuItem value='low'>Low</MenuItem>
							</Select>
						</FormControl>

						{/* Category Filter */}
						<FormControl size='small' sx={{ minWidth: 120 }}>
							<InputLabel>Category</InputLabel>
							<Select
								value={categoryFilter}
								onChange={(e) =>
									setCategoryFilter(e.target.value)
								}
								label='Category'>
								<MenuItem value='all'>All</MenuItem>
								{categories.map((category) => (
									<MenuItem
										key={category._id}
										value={category._id}>
										{category.name}
									</MenuItem>
								))}
							</Select>
						</FormControl>

						<Button
							variant='outlined'
							startIcon={<FilterList />}
							onClick={() => {
								setSearchTerm("");
								setStatusFilter("all");
								setPriorityFilter("all");
								setCategoryFilter("all");
							}}>
							Clear Filters
						</Button>
					</Box>
				</CardContent>
			</Card>

			{/* Todo List */}
			<Card>
				<CardContent>
					{isLoading ? (
						<Typography>Loading todos...</Typography>
					) : error ? (
						<Typography color='error'>
							Failed to load todos
						</Typography>
					) : todos.length === 0 ? (
						<Box sx={{ textAlign: "center", py: 4 }}>
							<Typography
								variant='h6'
								color='text.secondary'
								gutterBottom>
								No todos found
							</Typography>
							<Typography color='text.secondary' gutterBottom>
								{searchTerm ||
								statusFilter !== "all" ||
								priorityFilter !== "all" ||
								categoryFilter !== "all"
									? "Try adjusting your filters"
									: "Create your first todo to get started!"}
							</Typography>
							<Button
								variant='contained'
								startIcon={<Add />}
								onClick={() => handleOpenTodoDialog()}
								sx={{ mt: 2 }}>
								Add Todo
							</Button>
						</Box>
					) : (
						<List>
							<AnimatePresence>
								{todos.map((todo, index) => (
									<motion.div
										key={todo._id}
										initial={{ opacity: 0, y: 20 }}
										animate={{ opacity: 1, y: 0 }}
										exit={{ opacity: 0, y: -20 }}
										transition={{
											duration: 0.3,
											delay: index * 0.05,
										}}>
										<ListItem
											divider
											sx={{
												bgcolor: todo.completed
													? "action.hover"
													: "inherit",
												borderLeft: `4px solid ${
													isOverdue(
														todo.dueDate,
														todo.completed
													)
														? "error.main"
														: todo.category
																?.color ||
														  "primary.main"
												}`,
											}}>
											{/* Checkbox */}
											<ListItemIcon>
												<Checkbox
													checked={todo.completed}
													onChange={() =>
														handleToggleTodo(
															todo._id
														)
													}
													disabled={
														toggleTodoMutation.isLoading
													}
												/>
											</ListItemIcon>

											{/* Todo Content */}
											<ListItemText
												primary={
													<Box
														sx={{
															display: "flex",
															alignItems:
																"center",
															gap: 1,
														}}>
														<Typography
															variant='subtitle1'
															sx={{
																textDecoration:
																	todo.completed
																		? "line-through"
																		: "none",
																opacity:
																	todo.completed
																		? 0.7
																		: 1,
															}}>
															{todo.title}
														</Typography>
														<Chip
															icon={<Flag />}
															label={
																todo.priority
															}
															size='small'
															color={getPriorityColor(
																todo.priority
															)}
														/>
														{todo.category && (
															<Chip
																label={
																	todo
																		.category
																		.name
																}
																size='small'
																sx={{
																	bgcolor:
																		todo
																			.category
																			.color,
																	color: "white",
																}}
															/>
														)}
														{isOverdue(
															todo.dueDate,
															todo.completed
														) && (
															<Chip
																label='Overdue'
																size='small'
																color='error'
															/>
														)}
													</Box>
												}
												secondary={
													<Box>
														{todo.description && (
															<Typography
																variant='body2'
																color='text.secondary'
																sx={{ mb: 1 }}>
																{
																	todo.description
																}
															</Typography>
														)}
														<Box
															sx={{
																display: "flex",
																alignItems:
																	"center",
																gap: 2,
															}}>
															{todo.dueDate && (
																<Box
																	sx={{
																		display:
																			"flex",
																		alignItems:
																			"center",
																		gap: 0.5,
																	}}>
																	<CalendarToday
																		sx={{
																			fontSize: 16,
																		}}
																	/>
																	<Typography variant='caption'>
																		{formatDueDate(
																			todo.dueDate
																		)}
																	</Typography>
																</Box>
															)}
															{todo.tags?.length >
																0 && (
																<Box
																	sx={{
																		display:
																			"flex",
																		gap: 0.5,
																	}}>
																	{todo.tags.map(
																		(
																			tag
																		) => (
																			<Chip
																				key={
																					tag
																				}
																				label={
																					tag
																				}
																				size='small'
																				variant='outlined'
																			/>
																		)
																	)}
																</Box>
															)}
														</Box>
													</Box>
												}
											/>

											{/* Actions Menu */}
											<IconButton
												onClick={(e) =>
													handleMenuOpen(e, todo)
												}
												disabled={
													deleteTodoMutation.isLoading
												}>
												<MoreVert />
											</IconButton>
										</ListItem>
									</motion.div>
								))}
							</AnimatePresence>
						</List>
					)}
				</CardContent>
			</Card>

			{/* Actions Menu */}
			<Menu
				anchorEl={anchorEl}
				open={Boolean(anchorEl)}
				onClose={handleMenuClose}>
				<MenuItem onClick={() => handleOpenTodoDialog(selectedTodo)}>
					<Edit sx={{ mr: 1 }} />
					Edit
				</MenuItem>
				<MenuItem
					onClick={() => handleDeleteTodo(selectedTodo?._id)}
					sx={{ color: "error.main" }}>
					<Delete sx={{ mr: 1 }} />
					Delete
				</MenuItem>
			</Menu>

			{/* Floating Action Button */}
			<Fab
				color='primary'
				onClick={() => handleOpenTodoDialog()}
				sx={{
					position: "fixed",
					bottom: 24,
					right: 24,
				}}>
				<Add />
			</Fab>

			{/* Todo Dialog */}
			<TodoDialog
				open={todoDialogOpen}
				onClose={handleCloseTodoDialog}
				todo={editingTodo}
				mode={editingTodo ? "edit" : "create"}
			/>
		</Box>
	);
};

export default TodoList;
