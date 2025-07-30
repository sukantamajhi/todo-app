// Development utilities for debugging and component inspection

export const isDevelopment = import.meta.env.DEV;

// Component debugging utilities
export const logComponent = (componentName, props = {}, state = {}) => {
	if (!isDevelopment) return;

	console.group(`🔍 Component: ${componentName}`);
	console.log("Props:", props);
	console.log("State:", state);
	console.groupEnd();
};

// Performance monitoring
export const measureRender = (componentName, renderFn) => {
	if (!isDevelopment) return renderFn();

	const start = performance.now();
	const result = renderFn();
	const end = performance.now();

	console.log(
		`⏱️ ${componentName} render time: ${(end - start).toFixed(2)}ms`
	);
	return result;
};

// Component boundary highlighting
export const addComponentBoundary = (element, componentName, fileName) => {
	if (!isDevelopment || !element) return;

	element.setAttribute("data-component", componentName);
	element.setAttribute("data-file", fileName);
	element.setAttribute("data-dev-id", `${componentName}-${Date.now()}`);
};

// Query debugging
export const logQuery = (queryKey, data, isLoading, error) => {
	if (!isDevelopment) return;

	console.group(
		`📡 Query: ${Array.isArray(queryKey) ? queryKey.join("-") : queryKey}`
	);
	console.log("Loading:", isLoading);
	console.log("Data:", data);
	if (error) console.error("Error:", error);
	console.groupEnd();
};

// State change tracking
export const trackStateChange = (componentName, oldState, newState) => {
	if (!isDevelopment) return;

	console.group(`📝 State Change: ${componentName}`);
	console.log("Old State:", oldState);
	console.log("New State:", newState);
	console.log("Changes:", getChanges(oldState, newState));
	console.groupEnd();
};

// Helper function to get state changes
const getChanges = (oldState, newState) => {
	const changes = {};

	Object.keys(newState).forEach((key) => {
		if (oldState[key] !== newState[key]) {
			changes[key] = {
				from: oldState[key],
				to: newState[key],
			};
		}
	});

	return changes;
};

// API call debugging
export const logAPI = (method, url, data, response) => {
	if (!isDevelopment) return;

	console.group(`🌐 API ${method.toUpperCase()}: ${url}`);
	if (data) console.log("Request Data:", data);
	console.log("Response:", response);
	console.groupEnd();
};

// Component tree visualization
export const visualizeComponentTree = () => {
	if (!isDevelopment) return;

	const components = document.querySelectorAll("[data-component]");
	const tree = {};

	components.forEach((el) => {
		const component = el.getAttribute("data-component");
		const file = el.getAttribute("data-file");

		if (!tree[component]) {
			tree[component] = {
				file,
				instances: 0,
				elements: [],
			};
		}

		tree[component].instances++;
		tree[component].elements.push(el);
	});

	console.group("🌳 Component Tree");
	console.table(tree);
	console.groupEnd();

	return tree;
};

// Global development utilities
if (isDevelopment) {
	// Add to window for easy access in console
	window.devtools = {
		logComponent,
		measureRender,
		logQuery,
		trackStateChange,
		logAPI,
		visualizeComponentTree,
		// Quick access to highlight all components
		highlightComponents: () => {
			document.querySelectorAll("[data-component]").forEach((el) => {
				el.style.outline = "1px solid red";
				el.style.outlineOffset = "2px";
			});
		},
		// Remove highlighting
		unhighlightComponents: () => {
			document.querySelectorAll("[data-component]").forEach((el) => {
				el.style.outline = "";
				el.style.outlineOffset = "";
			});
		},
	};

	console.log("🛠️ Development tools available at window.devtools");
}
