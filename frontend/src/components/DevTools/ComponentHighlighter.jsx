import { useEffect, useState } from "react";
import { Box, Chip, Paper, Typography } from "@mui/material";

const ComponentHighlighter = () => {
	const [hoveredComponent, setHoveredComponent] = useState(null);
	const [isEnabled, setIsEnabled] = useState(false);

	useEffect(() => {
		// Only enable in development
		if (import.meta.env.DEV) {
			const handleKeyPress = (e) => {
				// Toggle with Ctrl+Shift+C
				if (e.ctrlKey && e.shiftKey && e.key === "C") {
					setIsEnabled(!isEnabled);
				}
			};

			const handleMouseOver = (e) => {
				if (!isEnabled) return;

				const component = e.target.getAttribute("data-component");
				const file = e.target.getAttribute("data-file");

				if (component && file) {
					setHoveredComponent({
						name: component,
						file: file,
						element: e.target,
					});

					// Add highlight style
					e.target.style.outline = "2px solid #ff6b6b";
					e.target.style.outlineOffset = "2px";
				}
			};

			const handleMouseOut = (e) => {
				if (!isEnabled) return;

				// Remove highlight style
				e.target.style.outline = "";
				e.target.style.outlineOffset = "";
				setHoveredComponent(null);
			};

			document.addEventListener("keydown", handleKeyPress);

			if (isEnabled) {
				document.addEventListener("mouseover", handleMouseOver);
				document.addEventListener("mouseout", handleMouseOut);
			}

			return () => {
				document.removeEventListener("keydown", handleKeyPress);
				document.removeEventListener("mouseover", handleMouseOver);
				document.removeEventListener("mouseout", handleMouseOut);
			};
		}
	}, [isEnabled]);

	if (!import.meta.env.DEV || !isEnabled) {
		return null;
	}

	return (
		<>
			{/* Toggle indicator */}
			<Paper
				sx={{
					position: "fixed",
					top: 16,
					right: 16,
					p: 1,
					zIndex: 9999,
					backgroundColor: "primary.main",
					color: "primary.contrastText",
				}}>
				<Typography variant='caption'>
					Component Inspector ON (Ctrl+Shift+C to toggle)
				</Typography>
			</Paper>

			{/* Component info */}
			{hoveredComponent && (
				<Paper
					sx={{
						position: "fixed",
						top: 60,
						right: 16,
						p: 2,
						zIndex: 9999,
						minWidth: 200,
					}}>
					<Typography variant='h6' gutterBottom>
						Component Info
					</Typography>
					<Box
						sx={{
							display: "flex",
							flexDirection: "column",
							gap: 1,
						}}>
						<Chip
							label={`Component: ${hoveredComponent.name}`}
							color='primary'
							size='small'
						/>
						<Chip
							label={`File: ${hoveredComponent.file}`}
							color='secondary'
							size='small'
						/>
					</Box>
				</Paper>
			)}
		</>
	);
};

export default ComponentHighlighter;
