import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const ProtectedRoute = () => {
	const { user, isLoading } = useAuth();

	if (isLoading) {
		// Optional loading spinner or splash screen
		return (
			<div className="w-screen h-dvh flex items-center justify-center">
				<p className="text-lg font-semibold">Checking authentication...</p>
			</div>
		);
	}

	// Redirect if not logged in
	if (!user) {
		return <Navigate to="/login" replace />;
	}

	// Otherwise, render the nested route
	return <Outlet />;
};

export default ProtectedRoute;
