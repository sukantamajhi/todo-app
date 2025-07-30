import React from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import { motion } from "framer-motion";

const LoadingScreen = ({ message = "Loading..." }) => {
	return (
		<Box
			sx={{
				minHeight: "100vh",
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				justifyContent: "center",
				bgcolor: "background.default",
			}}>
			<motion.div
				initial={{ opacity: 0, scale: 0.8 }}
				animate={{ opacity: 1, scale: 1 }}
				transition={{ duration: 0.3 }}>
				<CircularProgress size={60} thickness={4} />
			</motion.div>

			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.3, delay: 0.1 }}>
				<Typography
					variant='h6'
					sx={{ mt: 3, color: "text.secondary" }}>
					{message}
				</Typography>
			</motion.div>
		</Box>
	);
};

export default LoadingScreen;
