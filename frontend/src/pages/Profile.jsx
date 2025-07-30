import React, { useState } from "react";
import {
	Box,
	Card,
	CardContent,
	Typography,
	TextField,
	Button,
	Switch,
	FormControlLabel,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	Divider,
	Alert,
	Avatar,
	Grid,
} from "@mui/material";
import {
	Person,
	Email,
	Settings,
	Palette,
	Visibility,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { format } from "date-fns";

import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";

const Profile = () => {
	const [activeTab, setActiveTab] = useState("profile");
	const { user, updateUser, updatePreferences, isUpdating } = useAuth();
	const { isDark, toggleTheme } = useTheme();

	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm({
		defaultValues: {
			name: user?.name || "",
			email: user?.email || "",
		},
	});

	const [preferences, setPreferences] = useState({
		theme: user?.preferences?.theme || "light",
		defaultView: user?.preferences?.defaultView || "list",
		notifications: user?.preferences?.notifications ?? true,
	});

	const onSubmitProfile = async (data) => {
		try {
			await updateUser(data);
			reset(data);
		} catch (error) {
			// Error is handled by the context
		}
	};

	const onSubmitPreferences = async () => {
		try {
			await updatePreferences(preferences);
		} catch (error) {
			// Error is handled by the context
		}
	};

	const handlePreferenceChange = (key, value) => {
		setPreferences((prev) => ({
			...prev,
			[key]: value,
		}));
	};

	return (
		<Box>
			{/* Header */}
			<Box sx={{ mb: 4 }}>
				<Typography variant='h4' gutterBottom>
					Profile & Settings
				</Typography>
				<Typography variant='body1' color='text.secondary'>
					Manage your account information and preferences
				</Typography>
			</Box>

			<Grid container spacing={3}>
				{/* Profile Card */}
				<Grid item xs={12} md={4}>
					<motion.div
						initial={{ opacity: 0, x: -20 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.5 }}>
						<Card>
							<CardContent sx={{ textAlign: "center" }}>
								<Avatar
									sx={{
										width: 80,
										height: 80,
										mx: "auto",
										mb: 2,
										bgcolor: "primary.main",
										fontSize: "2rem",
									}}>
									{user?.name?.charAt(0).toUpperCase()}
								</Avatar>
								<Typography variant='h6' gutterBottom>
									{user?.name}
								</Typography>
								<Typography
									variant='body2'
									color='text.secondary'
									gutterBottom>
									{user?.email}
								</Typography>
								<Typography
									variant='caption'
									color='text.secondary'>
									Member since{" "}
									{format(
										new Date(user?.createdAt || new Date()),
										"MMM yyyy"
									)}
								</Typography>
							</CardContent>
						</Card>
					</motion.div>
				</Grid>

				{/* Settings */}
				<Grid item xs={12} md={8}>
					<motion.div
						initial={{ opacity: 0, x: 20 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.5 }}>
						<Card>
							<CardContent>
								{/* Profile Information */}
								<Box sx={{ mb: 4 }}>
									<Box
										sx={{
											display: "flex",
											alignItems: "center",
											mb: 3,
										}}>
										<Person
											sx={{
												mr: 1,
												color: "primary.main",
											}}
										/>
										<Typography variant='h6'>
											Profile Information
										</Typography>
									</Box>

									<Box
										component='form'
										onSubmit={handleSubmit(
											onSubmitProfile
										)}>
										<TextField
											fullWidth
											label='Full Name'
											margin='normal'
											{...register("name", {
												required: "Name is required",
												minLength: {
													value: 2,
													message:
														"Name must be at least 2 characters",
												},
												maxLength: {
													value: 50,
													message:
														"Name cannot exceed 50 characters",
												},
											})}
											error={!!errors.name}
											helperText={errors.name?.message}
										/>

										<TextField
											fullWidth
											label='Email Address'
											type='email'
											margin='normal'
											{...register("email", {
												required: "Email is required",
												pattern: {
													value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
													message:
														"Invalid email address",
												},
											})}
											error={!!errors.email}
											helperText={errors.email?.message}
										/>

										<Button
											type='submit'
											variant='contained'
											disabled={isUpdating}
											sx={{ mt: 2 }}>
											{isUpdating
												? "Updating..."
												: "Update Profile"}
										</Button>
									</Box>
								</Box>

								<Divider sx={{ my: 3 }} />

								{/* Preferences */}
								<Box>
									<Box
										sx={{
											display: "flex",
											alignItems: "center",
											mb: 3,
										}}>
										<Settings
											sx={{
												mr: 1,
												color: "primary.main",
											}}
										/>
										<Typography variant='h6'>
											Preferences
										</Typography>
									</Box>

									{/* Theme Setting */}
									<Box sx={{ mb: 3 }}>
										<Box
											sx={{
												display: "flex",
												alignItems: "center",
												mb: 2,
											}}>
											<Palette
												sx={{
													mr: 1,
													color: "text.secondary",
												}}
											/>
											<Typography variant='subtitle1'>
												Appearance
											</Typography>
										</Box>

										<FormControl fullWidth>
											<InputLabel>Theme</InputLabel>
											<Select
												value={preferences.theme}
												onChange={(e) => {
													handlePreferenceChange(
														"theme",
														e.target.value
													);
													if (
														e.target.value !==
														(isDark
															? "dark"
															: "light")
													) {
														toggleTheme();
													}
												}}
												label='Theme'>
												<MenuItem value='light'>
													Light
												</MenuItem>
												<MenuItem value='dark'>
													Dark
												</MenuItem>
											</Select>
										</FormControl>
									</Box>

									{/* Default View Setting */}
									<Box sx={{ mb: 3 }}>
										<Box
											sx={{
												display: "flex",
												alignItems: "center",
												mb: 2,
											}}>
											<Visibility
												sx={{
													mr: 1,
													color: "text.secondary",
												}}
											/>
											<Typography variant='subtitle1'>
												Default View
											</Typography>
										</Box>

										<FormControl fullWidth>
											<InputLabel>
												Default View
											</InputLabel>
											<Select
												value={preferences.defaultView}
												onChange={(e) =>
													handlePreferenceChange(
														"defaultView",
														e.target.value
													)
												}
												label='Default View'>
												<MenuItem value='list'>
													List View
												</MenuItem>
												<MenuItem value='grid'>
													Grid View
												</MenuItem>
												<MenuItem value='calendar'>
													Calendar View
												</MenuItem>
											</Select>
										</FormControl>
									</Box>

									{/* Notifications Setting */}
									<Box sx={{ mb: 3 }}>
										<FormControlLabel
											control={
												<Switch
													checked={
														preferences.notifications
													}
													onChange={(e) =>
														handlePreferenceChange(
															"notifications",
															e.target.checked
														)
													}
												/>
											}
											label='Enable Notifications'
										/>
										<Typography
											variant='caption'
											color='text.secondary'
											display='block'>
											Receive notifications for due dates
											and reminders
										</Typography>
									</Box>

									<Button
										variant='contained'
										onClick={onSubmitPreferences}
										disabled={isUpdating}
										sx={{ mt: 2 }}>
										{isUpdating
											? "Saving..."
											: "Save Preferences"}
									</Button>
								</Box>

								<Divider sx={{ my: 3 }} />

								{/* Account Information */}
								<Box>
									<Typography variant='h6' gutterBottom>
										Account Information
									</Typography>

									<Alert severity='info' sx={{ mt: 2 }}>
										<Typography variant='body2'>
											<strong>Account Created:</strong>{" "}
											{format(
												new Date(
													user?.createdAt ||
														new Date()
												),
												"PPP"
											)}
										</Typography>
										{user?.lastLoginAt && (
											<Typography
												variant='body2'
												sx={{ mt: 1 }}>
												<strong>Last Login:</strong>{" "}
												{format(
													new Date(user.lastLoginAt),
													"PPp"
												)}
											</Typography>
										)}
									</Alert>
								</Box>
							</CardContent>
						</Card>
					</motion.div>
				</Grid>
			</Grid>
		</Box>
	);
};

export default Profile;
