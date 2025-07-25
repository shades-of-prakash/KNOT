import React, { createContext, useContext, useState } from "react";
import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
	const [token, setToken] = useState(() => localStorage.getItem("token"));
	const queryClient = useQueryClient();

	const { data: user, isLoading } = useQuery({
		queryKey: ["me"],
		queryFn: async () => {
			if (!token) return null;
			const res = await fetch("/api/v1/auth/me", {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			if (!res.ok) throw new Error("Not authenticated");
			const data = await res.json();
			return data.user;
		},
		enabled: !!token,
		refetchOnWindowFocus: false,
	});
	const loginMutation = useMutation({
		mutationFn: async ({ username, password }) => {
			try {
				const res = await fetch("/api/v1/auth/login", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ username, password }),
				});
				console.log(res);

				let data = {};
				try {
					data = await res.json();
				} catch {
					throw new Error("Server error. Please try again later.");
				}

				if (!res.ok) throw new Error(data.error || "Login failed");
				return data;
			} catch (err) {
				console.log(err);
				throw new Error(err.message || "Network error");
			}
		},
		onSuccess: (data) => {
			localStorage.setItem("token", data.token);
			setToken(data.token);
			queryClient.invalidateQueries({ queryKey: ["me"] });
		},
	});

	const registerMutation = useMutation({
		mutationFn: async ({ username, email, password }) => {
			try {
				const res = await fetch("/api/v1/auth/register", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ username, email, password }),
				});

				let data = {};
				try {
					data = await res.json();
				} catch {
					throw new Error("Server error. Please try again later.");
				}

				if (!res.ok) throw new Error(data.error || "Registration failed");
				return data;
			} catch (err) {
				throw new Error(err.message || "Network error");
			}
		},
		onSuccess: (data) => {
			localStorage.setItem("token", data.token);
			setToken(data.token);
			queryClient.invalidateQueries({ queryKey: ["me"] });
		},
	});

	const logout = () => {
		localStorage.removeItem("token");
		setToken(null);
		queryClient.setQueryData(["me"], null);
	};

	return (
		<AuthContext.Provider
			value={{
				user,
				isLoading,
				login: loginMutation,
				register: registerMutation,
				logout,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => useContext(AuthContext);
