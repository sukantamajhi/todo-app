import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
	Box,
	Card,
	CardContent,
	TextField,
	Button,
	Typography,
	InputAdornment,
	IconButton,
	Alert,
	Container,
} from "@mui/material";
import {
	Visibility,
	VisibilityOff,
	Email,
	Lock,
	Person,
	Assignment,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { useAuth } from "../contexts/AuthContext";

const Register = () => {
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [error, setError] = useState("");
	const { register: registerUser, isRegistering } = useAuth();
	const navigate = useNavigate();

	const {
		register,
		handleSubmit,
		watch,
		formState: { errors },
	} = useForm();

	const password = watch("password");

	const onSubmit = async (data) => {
		try {
			setError("");
			const { confirmPassword, ...userData } = data;
			await registerUser(userData);
			navigate("/dashboard");
		} catch (err) {
			setError(err.response?.data?.message || "Registration failed");
		}
	};

	return (
		<Container maxWidth='sm'>
			<Box
				sx={{
					minHeight: "100vh",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					py: 4,
				}}>
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
					style={{ width: "100%" }}>
					<Card sx={{ p: 2 }}>
						<CardContent>
							{/* Logo and Title */}
							<Box sx={{ textAlign: "center", mb: 4 }}>
								<Assignment
									sx={{
										fontSize: 48,
										color: "primary.main",
										mb: 2,
									}}
								/>
								<Typography
									variant='h4'
									component='h1'
									gutterBottom>
									Get Started
								</Typography>
								<Typography
									variant='body1'
									color='text.secondary'>
									Create your todo account
								</Typography>
							</Box>

							{/* Error Alert */}
							{error && (
								<Alert severity='error' sx={{ mb: 3 }}>
									{error}
								</Alert>
							)}

							{/* Registration Form */}
							<Box
								component='form'
								onSubmit={handleSubmit(onSubmit)}>
								<TextField
									fullWidth
									label='Full Name'
									margin='normal'
									autoComplete='name'
									autoFocus
									InputProps={{
										startAdornment: (
											<InputAdornment position='start'>
												<Person />
											</InputAdornment>
										),
									}}
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
									autoComplete='email'
									InputProps={{
										startAdornment: (
											<InputAdornment position='start'>
												<Email />
											</InputAdornment>
										),
									}}
									{...register("email", {
										required: "Email is required",
										pattern: {
											value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
											message: "Invalid email address",
										},
									})}
									error={!!errors.email}
									helperText={errors.email?.message}
								/>

								<TextField
									fullWidth
									label='Password'
									type={showPassword ? "text" : "password"}
									margin='normal'
									autoComplete='new-password'
									InputProps={{
										startAdornment: (
											<InputAdornment position='start'>
												<Lock />
											</InputAdornment>
										),
										endAdornment: (
											<InputAdornment position='end'>
												<IconButton
													onClick={() =>
														setShowPassword(
															!showPassword
														)
													}
													edge='end'>
													{showPassword ? (
														<VisibilityOff />
													) : (
														<Visibility />
													)}
												</IconButton>
											</InputAdornment>
										),
									}}
									{...register("password", {
										required: "Password is required",
										minLength: {
											value: 6,
											message:
												"Password must be at least 6 characters",
										},
										pattern: {
											value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
											message:
												"Password must contain at least one lowercase letter, one uppercase letter, and one number",
										},
									})}
									error={!!errors.password}
									helperText={errors.password?.message}
								/>

								<TextField
									fullWidth
									label='Confirm Password'
									type={
										showConfirmPassword
											? "text"
											: "password"
									}
									margin='normal'
									autoComplete='new-password'
									InputProps={{
										startAdornment: (
											<InputAdornment position='start'>
												<Lock />
											</InputAdornment>
										),
										endAdornment: (
											<InputAdornment position='end'>
												<IconButton
													onClick={() =>
														setShowConfirmPassword(
															!showConfirmPassword
														)
													}
													edge='end'>
													{showConfirmPassword ? (
														<VisibilityOff />
													) : (
														<Visibility />
													)}
												</IconButton>
											</InputAdornment>
										),
									}}
									{...register("confirmPassword", {
										required:
											"Please confirm your password",
										validate: (value) =>
											value === password ||
											"Passwords do not match",
									})}
									error={!!errors.confirmPassword}
									helperText={errors.confirmPassword?.message}
								/>

								<Button
									type='submit'
									fullWidth
									variant='contained'
									size='large'
									disabled={isRegistering}
									sx={{ mt: 3, mb: 2, py: 1.5 }}>
									{isRegistering
										? "Creating Account..."
										: "Create Account"}
								</Button>

								<Box sx={{ textAlign: "center" }}>
									<Typography variant='body2'>
										Already have an account?{" "}
										<Link
											to='/login'
											style={{
												color: "inherit",
												textDecoration: "underline",
											}}>
											Sign in here
										</Link>
									</Typography>
								</Box>
							</Box>
						</CardContent>
					</Card>
				</motion.div>
			</Box>
		</Container>
	);
};

export default Register;
