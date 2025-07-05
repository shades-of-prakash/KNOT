import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router";

const Signup = () => {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const navigate = useNavigate();
	const { register } = useAuth();

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");
		try {
			await register.mutateAsync({ username, password });
			navigate("/");
		} catch (err) {
			setError(err.message || "Registration failed");
		}
	};

	return (
		<form onSubmit={handleSubmit}>
			<h2>Signup</h2>
			{error && <p style={{ color: "red" }}>{error}</p>}
			<input
				type="text"
				placeholder="Username"
				value={username}
				onChange={(e) => setUsername(e.target.value)}
				required
			/>
			<input
				type="password"
				placeholder="Password"
				value={password}
				onChange={(e) => setPassword(e.target.value)}
				required
			/>
			<button type="submit">
				{register.isPending ? "Registering..." : "Register"}
			</button>
		</form>
	);
};

export default Signup;
