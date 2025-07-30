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
	Assignment,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { useAuth } from "../contexts/AuthContext";

const Login = () => {
	const [showPassword, setShowPassword] = useState(false);
	const [error, setError] = useState("");
	const { login, isLoggingIn } = useAuth();
	const navigate = useNavigate();

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm();

	const onSubmit = async (data) => {
		try {
			setError("");
			await login(data);
			navigate("/dashboard");
		} catch (err) {
			setError(err.response?.data?.message || "Login failed");
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
									Welcome Back
								</Typography>
								<Typography
									variant='body1'
									color='text.secondary'>
									Sign in to your todo account
								</Typography>
							</Box>

							{/* Error Alert */}
							{error && (
								<Alert severity='error' sx={{ mb: 3 }}>
									{error}
								</Alert>
							)}

							{/* Login Form */}
							<Box
								component='form'
								onSubmit={handleSubmit(onSubmit)}>
								<TextField
									fullWidth
									label='Email Address'
									type='email'
									margin='normal'
									autoComplete='email'
									autoFocus
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
									autoComplete='current-password'
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
									})}
									error={!!errors.password}
									helperText={errors.password?.message}
								/>

								<Button
									type='submit'
									fullWidth
									variant='contained'
									size='large'
									disabled={isLoggingIn}
									sx={{ mt: 3, mb: 2, py: 1.5 }}>
									{isLoggingIn ? "Signing In..." : "Sign In"}
								</Button>

								<Box sx={{ textAlign: "center" }}>
									<Typography variant='body2'>
										Don't have an account?{" "}
										<Link
											to='/register'
											style={{
												color: "inherit",
												textDecoration: "underline",
											}}>
											Sign up here
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

export default Login;
