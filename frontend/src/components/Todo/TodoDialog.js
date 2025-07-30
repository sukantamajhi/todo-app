import React, { useState, useEffect } from "react";
import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	TextField,
	Button,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	Chip,
	Box,
	Typography,
	Grid,
	Switch,
	FormControlLabel,
	IconButton,
} from "@mui/material";
import {
	Add,
	Close,
	CalendarToday,
	Flag,
	Category,
	Label,
} from "@mui/icons-material";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { useForm, Controller } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { toast } from "react-toastify";

import todoAPI from "../../services/todoAPI";
import categoryAPI from "../../services/categoryAPI";

const priorityOptions = [
	{ value: "low", label: "Low", color: "success" },
	{ value: "medium", label: "Medium", color: "info" },
	{ value: "high", label: "High", color: "warning" },
	{ value: "critical", label: "Critical", color: "error" },
];

const TodoDialog = ({ open, onClose, todo = null, mode = "create" }) => {
	const [tags, setTags] = useState([]);
	const [newTag, setNewTag] = useState("");
	const queryClient = useQueryClient();

	const {
		control,
		register,
		handleSubmit,
		reset,
		watch,
		setValue,
		formState: { errors },
	} = useForm({
		defaultValues: {
			title: "",
			description: "",
			priority: "medium",
			category: "",
			dueDate: null,
			reminderDate: null,
		},
	});

	// Get categories for dropdown
	const { data: categoriesData } = useQuery(
		"categories",
		categoryAPI.getCategories
	);
	const categories = categoriesData?.data || [];

	// Create todo mutation
	const createTodoMutation = useMutation(todoAPI.createTodo, {
		onSuccess: () => {
			queryClient.invalidateQueries("todos");
			queryClient.invalidateQueries("todoStats");
			toast.success("Todo created successfully!");
			handleClose();
		},
		onError: (error) => {
			toast.error(
				error.response?.data?.message || "Failed to create todo"
			);
		},
	});

	// Update todo mutation
	const updateTodoMutation = useMutation(
		({ id, data }) => todoAPI.updateTodo(id, data),
		{
			onSuccess: () => {
				queryClient.invalidateQueries("todos");
				queryClient.invalidateQueries("todoStats");
				toast.success("Todo updated successfully!");
				handleClose();
			},
			onError: (error) => {
				toast.error(
					error.response?.data?.message || "Failed to update todo"
				);
			},
		}
	);

	// Initialize form when todo changes (for edit mode)
	useEffect(() => {
		if (todo && mode === "edit") {
			setValue("title", todo.title || "");
			setValue("description", todo.description || "");
			setValue("priority", todo.priority || "medium");
			setValue("category", todo.category?._id || "");
			setValue("dueDate", todo.dueDate ? new Date(todo.dueDate) : null);
			setValue(
				"reminderDate",
				todo.reminderDate ? new Date(todo.reminderDate) : null
			);
			setTags(todo.tags || []);
		} else {
			reset();
			setTags([]);
		}
	}, [todo, mode, reset, setValue]);

	const handleClose = () => {
		reset();
		setTags([]);
		setNewTag("");
		onClose();
	};

	const onSubmit = (data) => {
		const todoData = {
			...data,
			tags,
			dueDate: data.dueDate ? data.dueDate.toISOString() : null,
			reminderDate: data.reminderDate
				? data.reminderDate.toISOString()
				: null,
		};

		if (mode === "edit" && todo) {
			updateTodoMutation.mutate({ id: todo._id, data: todoData });
		} else {
			createTodoMutation.mutate(todoData);
		}
	};

	const handleAddTag = () => {
		if (newTag.trim() && !tags.includes(newTag.trim())) {
			setTags([...tags, newTag.trim()]);
			setNewTag("");
		}
	};

	const handleRemoveTag = (tagToRemove) => {
		setTags(tags.filter((tag) => tag !== tagToRemove));
	};

	const handleKeyPress = (event) => {
		if (event.key === "Enter") {
			event.preventDefault();
			handleAddTag();
		}
	};

	const isLoading =
		createTodoMutation.isLoading || updateTodoMutation.isLoading;

	return (
		<LocalizationProvider dateAdapter={AdapterDateFns}>
			<Dialog open={open} onClose={handleClose} maxWidth='md' fullWidth>
				<DialogTitle>
					<Box
						sx={{
							display: "flex",
							justifyContent: "space-between",
							alignItems: "center",
						}}>
						<Typography variant='h6'>
							{mode === "edit" ? "Edit Todo" : "Create New Todo"}
						</Typography>
						<IconButton onClick={handleClose}>
							<Close />
						</IconButton>
					</Box>
				</DialogTitle>

				<DialogContent dividers>
					<Box component='form' sx={{ mt: 1 }}>
						<Grid container spacing={3}>
							{/* Title */}
							<Grid item xs={12}>
								<TextField
									fullWidth
									label='Todo Title'
									{...register("title", {
										required: "Title is required",
										maxLength: {
											value: 100,
											message:
												"Title cannot exceed 100 characters",
										},
									})}
									error={!!errors.title}
									helperText={errors.title?.message}
									autoFocus
								/>
							</Grid>

							{/* Description */}
							<Grid item xs={12}>
								<TextField
									fullWidth
									label='Description'
									multiline
									rows={3}
									{...register("description", {
										maxLength: {
											value: 500,
											message:
												"Description cannot exceed 500 characters",
										},
									})}
									error={!!errors.description}
									helperText={errors.description?.message}
								/>
							</Grid>

							{/* Priority and Category */}
							<Grid item xs={12} sm={6}>
								<FormControl fullWidth>
									<InputLabel>Priority</InputLabel>
									<Controller
										name='priority'
										control={control}
										render={({ field }) => (
											<Select {...field} label='Priority'>
												{priorityOptions.map(
													(option) => (
														<MenuItem
															key={option.value}
															value={
																option.value
															}>
															<Box
																sx={{
																	display:
																		"flex",
																	alignItems:
																		"center",
																	gap: 1,
																}}>
																<Flag
																	color={
																		option.color
																	}
																/>
																{option.label}
															</Box>
														</MenuItem>
													)
												)}
											</Select>
										)}
									/>
								</FormControl>
							</Grid>

							<Grid item xs={12} sm={6}>
								<FormControl fullWidth>
									<InputLabel>Category</InputLabel>
									<Controller
										name='category'
										control={control}
										render={({ field }) => (
											<Select {...field} label='Category'>
												<MenuItem value=''>
													<em>No Category</em>
												</MenuItem>
												{categories.map((category) => (
													<MenuItem
														key={category._id}
														value={category._id}>
														<Box
															sx={{
																display: "flex",
																alignItems:
																	"center",
																gap: 1,
															}}>
															<Box
																sx={{
																	width: 16,
																	height: 16,
																	borderRadius:
																		"50%",
																	bgcolor:
																		category.color,
																}}
															/>
															{category.name}
														</Box>
													</MenuItem>
												))}
											</Select>
										)}
									/>
								</FormControl>
							</Grid>

							{/* Due Date and Reminder */}
							<Grid item xs={12} sm={6}>
								<Controller
									name='dueDate'
									control={control}
									render={({ field }) => (
										<DateTimePicker
											label='Due Date'
											value={field.value}
											onChange={field.onChange}
											slotProps={{
												textField: {
													fullWidth: true,
												},
											}}
										/>
									)}
								/>
							</Grid>

							<Grid item xs={12} sm={6}>
								<Controller
									name='reminderDate'
									control={control}
									render={({ field }) => (
										<DateTimePicker
											label='Reminder Date'
											value={field.value}
											onChange={field.onChange}
											slotProps={{
												textField: {
													fullWidth: true,
												},
											}}
										/>
									)}
								/>
							</Grid>

							{/* Tags */}
							<Grid item xs={12}>
								<Typography variant='subtitle2' gutterBottom>
									Tags
								</Typography>
								<Box
									sx={{
										display: "flex",
										alignItems: "center",
										gap: 1,
										mb: 2,
									}}>
									<TextField
										size='small'
										label='Add tag'
										value={newTag}
										onChange={(e) =>
											setNewTag(e.target.value)
										}
										onKeyPress={handleKeyPress}
										sx={{ flexGrow: 1 }}
									/>
									<Button
										variant='outlined'
										onClick={handleAddTag}
										disabled={!newTag.trim()}
										startIcon={<Add />}>
										Add
									</Button>
								</Box>
								<Box
									sx={{
										display: "flex",
										flexWrap: "wrap",
										gap: 1,
									}}>
									{tags.map((tag) => (
										<Chip
											key={tag}
											label={tag}
											onDelete={() =>
												handleRemoveTag(tag)
											}
											variant='outlined'
										/>
									))}
								</Box>
							</Grid>
						</Grid>
					</Box>
				</DialogContent>

				<DialogActions>
					<Button onClick={handleClose}>Cancel</Button>
					<Button
						onClick={handleSubmit(onSubmit)}
						variant='contained'
						disabled={isLoading}>
						{isLoading
							? mode === "edit"
								? "Updating..."
								: "Creating..."
							: mode === "edit"
							? "Update Todo"
							: "Create Todo"}
					</Button>
				</DialogActions>
			</Dialog>
		</LocalizationProvider>
	);
};

export default TodoDialog;
