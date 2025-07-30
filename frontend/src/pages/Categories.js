import React, { useState } from "react";
import {
	Box,
	Card,
	CardContent,
	Typography,
	Button,
	Grid,
	Chip,
	IconButton,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	TextField,
	Menu,
	MenuItem,
	Fab,
} from "@mui/material";
import {
	Add,
	MoreVert,
	Edit,
	Delete,
	Category as CategoryIcon,
	Assignment,
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

import categoryAPI from "../services/categoryAPI";

const predefinedColors = [
	"#2196F3",
	"#4CAF50",
	"#FF9800",
	"#F44336",
	"#9C27B0",
	"#00BCD4",
	"#FFEB3B",
	"#795548",
	"#607D8B",
	"#E91E63",
	"#3F51B5",
	"#009688",
];

const Categories = () => {
	const [openDialog, setOpenDialog] = useState(false);
	const [editingCategory, setEditingCategory] = useState(null);
	const [anchorEl, setAnchorEl] = useState(null);
	const [selectedCategory, setSelectedCategory] = useState(null);
	const [selectedColor, setSelectedColor] = useState(predefinedColors[0]);

	const queryClient = useQueryClient();

	const {
		register,
		handleSubmit,
		reset,
		setValue,
		formState: { errors },
	} = useForm();

	// Fetch categories
	const {
		data: categoriesData,
		isLoading,
		error,
	} = useQuery("categories", categoryAPI.getCategories);

	// Create category mutation
	const createCategoryMutation = useMutation(categoryAPI.createCategory, {
		onSuccess: () => {
			queryClient.invalidateQueries("categories");
			toast.success("Category created successfully");
			handleCloseDialog();
		},
		onError: (error) => {
			toast.error(
				error.response?.data?.message || "Failed to create category"
			);
		},
	});

	// Update category mutation
	const updateCategoryMutation = useMutation(
		({ id, data }) => categoryAPI.updateCategory(id, data),
		{
			onSuccess: () => {
				queryClient.invalidateQueries("categories");
				toast.success("Category updated successfully");
				handleCloseDialog();
			},
			onError: (error) => {
				toast.error(
					error.response?.data?.message || "Failed to update category"
				);
			},
		}
	);

	// Delete category mutation
	const deleteCategoryMutation = useMutation(categoryAPI.deleteCategory, {
		onSuccess: () => {
			queryClient.invalidateQueries("categories");
			toast.success("Category deleted successfully");
			setAnchorEl(null);
		},
		onError: (error) => {
			toast.error(
				error.response?.data?.message || "Failed to delete category"
			);
		},
	});

	// Create default categories mutation
	const createDefaultsMutation = useMutation(
		categoryAPI.createDefaultCategories,
		{
			onSuccess: () => {
				queryClient.invalidateQueries("categories");
				toast.success("Default categories created successfully");
			},
			onError: (error) => {
				toast.error(
					error.response?.data?.message ||
						"Failed to create default categories"
				);
			},
		}
	);

	const handleOpenDialog = (category = null) => {
		setEditingCategory(category);
		if (category) {
			setValue("name", category.name);
			setValue("description", category.description || "");
			setSelectedColor(category.color);
		} else {
			reset();
			setSelectedColor(predefinedColors[0]);
		}
		setOpenDialog(true);
	};

	const handleCloseDialog = () => {
		setOpenDialog(false);
		setEditingCategory(null);
		reset();
	};

	const onSubmit = (data) => {
		const categoryData = {
			...data,
			color: selectedColor,
		};

		if (editingCategory) {
			updateCategoryMutation.mutate({
				id: editingCategory._id,
				data: categoryData,
			});
		} else {
			createCategoryMutation.mutate(categoryData);
		}
	};

	const handleMenuOpen = (event, category) => {
		setAnchorEl(event.currentTarget);
		setSelectedCategory(category);
	};

	const handleMenuClose = () => {
		setAnchorEl(null);
		setSelectedCategory(null);
	};

	const handleDeleteCategory = (categoryId) => {
		if (window.confirm("Are you sure you want to delete this category?")) {
			deleteCategoryMutation.mutate(categoryId);
		}
	};

	const categories = categoriesData?.data || [];

	return (
		<Box>
			{/* Header */}
			<Box sx={{ mb: 4 }}>
				<Typography variant='h4' gutterBottom>
					Categories
				</Typography>
				<Typography variant='body1' color='text.secondary'>
					Organize your todos with custom categories
				</Typography>
			</Box>

			{/* Quick Actions */}
			<Box sx={{ mb: 3, display: "flex", gap: 2 }}>
				<Button
					variant='contained'
					startIcon={<Add />}
					onClick={() => handleOpenDialog()}>
					New Category
				</Button>
				{categories.length === 0 && (
					<Button
						variant='outlined'
						onClick={() => createDefaultsMutation.mutate()}
						disabled={createDefaultsMutation.isLoading}>
						{createDefaultsMutation.isLoading
							? "Creating..."
							: "Create Default Categories"}
					</Button>
				)}
			</Box>

			{/* Categories Grid */}
			{isLoading ? (
				<Typography>Loading categories...</Typography>
			) : error ? (
				<Typography color='error'>Failed to load categories</Typography>
			) : categories.length === 0 ? (
				<Card>
					<CardContent sx={{ textAlign: "center", py: 6 }}>
						<CategoryIcon
							sx={{
								fontSize: 64,
								color: "text.secondary",
								mb: 2,
							}}
						/>
						<Typography
							variant='h6'
							color='text.secondary'
							gutterBottom>
							No categories yet
						</Typography>
						<Typography color='text.secondary' gutterBottom>
							Create categories to organize your todos better
						</Typography>
						<Button
							variant='contained'
							startIcon={<Add />}
							onClick={() => handleOpenDialog()}
							sx={{ mt: 2 }}>
							Create Category
						</Button>
					</CardContent>
				</Card>
			) : (
				<Grid container spacing={3}>
					<AnimatePresence>
						{categories.map((category, index) => (
							<Grid item xs={12} sm={6} md={4} key={category._id}>
								<motion.div
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, y: -20 }}
									transition={{
										duration: 0.3,
										delay: index * 0.1,
									}}>
									<Card
										sx={{
											height: "100%",
											borderLeft: `4px solid ${category.color}`,
											position: "relative",
										}}>
										<CardContent>
											{/* Category Header */}
											<Box
												sx={{
													display: "flex",
													justifyContent:
														"space-between",
													alignItems: "flex-start",
													mb: 2,
												}}>
												<Box
													sx={{
														display: "flex",
														alignItems: "center",
														gap: 1,
													}}>
													<Box
														sx={{
															width: 24,
															height: 24,
															borderRadius: "50%",
															bgcolor:
																category.color,
														}}
													/>
													<Typography
														variant='h6'
														component='h3'>
														{category.name}
													</Typography>
													{category.isDefault && (
														<Chip
															label='Default'
															size='small'
															color='primary'
														/>
													)}
												</Box>

												<IconButton
													size='small'
													onClick={(e) =>
														handleMenuOpen(
															e,
															category
														)
													}>
													<MoreVert />
												</IconButton>
											</Box>

											{/* Category Description */}
											{category.description && (
												<Typography
													variant='body2'
													color='text.secondary'
													sx={{ mb: 2 }}>
													{category.description}
												</Typography>
											)}

											{/* Todo Count */}
											<Box
												sx={{
													display: "flex",
													alignItems: "center",
													gap: 1,
												}}>
												<Assignment
													sx={{
														fontSize: 16,
														color: "text.secondary",
													}}
												/>
												<Typography
													variant='body2'
													color='text.secondary'>
													{category.todoCount} todo
													{category.todoCount !== 1
														? "s"
														: ""}
												</Typography>
											</Box>
										</CardContent>
									</Card>
								</motion.div>
							</Grid>
						))}
					</AnimatePresence>
				</Grid>
			)}

			{/* Actions Menu */}
			<Menu
				anchorEl={anchorEl}
				open={Boolean(anchorEl)}
				onClose={handleMenuClose}>
				<MenuItem
					onClick={() => {
						handleOpenDialog(selectedCategory);
						handleMenuClose();
					}}>
					<Edit sx={{ mr: 1 }} />
					Edit
				</MenuItem>
				{!selectedCategory?.isDefault && (
					<MenuItem
						onClick={() =>
							handleDeleteCategory(selectedCategory?._id)
						}
						sx={{ color: "error.main" }}>
						<Delete sx={{ mr: 1 }} />
						Delete
					</MenuItem>
				)}
			</Menu>

			{/* Create/Edit Dialog */}
			<Dialog
				open={openDialog}
				onClose={handleCloseDialog}
				maxWidth='sm'
				fullWidth>
				<DialogTitle>
					{editingCategory ? "Edit Category" : "Create New Category"}
				</DialogTitle>
				<DialogContent>
					<Box component='form' sx={{ mt: 2 }}>
						<TextField
							fullWidth
							label='Category Name'
							margin='normal'
							{...register("name", {
								required: "Category name is required",
								maxLength: {
									value: 30,
									message: "Name cannot exceed 30 characters",
								},
							})}
							error={!!errors.name}
							helperText={errors.name?.message}
							disabled={editingCategory?.isDefault}
						/>

						<TextField
							fullWidth
							label='Description (Optional)'
							margin='normal'
							multiline
							rows={3}
							{...register("description", {
								maxLength: {
									value: 200,
									message:
										"Description cannot exceed 200 characters",
								},
							})}
							error={!!errors.description}
							helperText={errors.description?.message}
						/>

						{/* Color Picker */}
						<Box sx={{ mt: 3 }}>
							<Typography variant='subtitle2' gutterBottom>
								Color
							</Typography>
							<Box
								sx={{
									display: "flex",
									flexWrap: "wrap",
									gap: 1,
								}}>
								{predefinedColors.map((color) => (
									<Box
										key={color}
										sx={{
											width: 32,
											height: 32,
											borderRadius: "50%",
											bgcolor: color,
											cursor: "pointer",
											border:
												selectedColor === color
													? "3px solid"
													: "1px solid",
											borderColor:
												selectedColor === color
													? "primary.main"
													: "divider",
											"&:hover": {
												transform: "scale(1.1)",
											},
										}}
										onClick={() => setSelectedColor(color)}
									/>
								))}
							</Box>
						</Box>
					</Box>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleCloseDialog}>Cancel</Button>
					<Button
						onClick={handleSubmit(onSubmit)}
						variant='contained'
						disabled={
							createCategoryMutation.isLoading ||
							updateCategoryMutation.isLoading
						}>
						{editingCategory ? "Update" : "Create"}
					</Button>
				</DialogActions>
			</Dialog>

			{/* Floating Action Button */}
			<Fab
				color='primary'
				sx={{
					position: "fixed",
					bottom: 24,
					right: 24,
				}}
				onClick={() => handleOpenDialog()}>
				<Add />
			</Fab>
		</Box>
	);
};

export default Categories;
