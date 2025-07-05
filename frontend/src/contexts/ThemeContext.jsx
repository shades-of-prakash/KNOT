import React, { createContext, useContext, useEffect, useState } from "react";

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
	const [theme, setTheme] = useState("light");

	useEffect(() => {
		const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
		console.log("mediaQuery", mediaQuery);
		const applyTheme = (nextTheme) => {
			setTheme(nextTheme);
			localStorage.setItem("theme", nextTheme);
			if (nextTheme === "dark") {
				document.documentElement.classList.add("dark");
			} else {
				document.documentElement.classList.remove("dark");
			}
		};

		// Load theme from localStorage or system preference
		const savedTheme = localStorage.getItem("theme");
		console.log("savedTheme", savedTheme);
		if (savedTheme) {
			applyTheme(savedTheme);
		} else {
			applyTheme(mediaQuery.matches ? "dark" : "");
		}

		const handleSystemChange = (e) => {
			const systemTheme = e.matches ? "dark" : "";
			applyTheme(systemTheme);
		};

		mediaQuery.addEventListener("change", handleSystemChange);

		return () => {
			mediaQuery.removeEventListener("change", handleSystemChange);
		};
	}, []);

	const toggleTheme = () => {
		const next = theme === "dark" ? "" : "dark";
		setTheme(next);
		localStorage.setItem("theme", next);
		if (next === "dark") {
			document.documentElement.classList.add("dark");
		} else {
			document.documentElement.classList.remove("dark");
		}
	};

	return (
		<ThemeContext.Provider value={{ theme, toggleTheme }}>
			{children}
		</ThemeContext.Provider>
	);
};
