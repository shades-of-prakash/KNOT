import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router";

const Login = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const { login } = useAuth();
	const navigate = useNavigate();

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			await login.mutateAsync({ email, password });
			navigate("/");
		} catch (_) {
			
		}
	};

	return (
		<div className="">
            <form onSubmit={handleSubmit}>
                <h2>Login</h2>
            
                <input
                    type="text"
                    placeholder="Username"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit" disabled={login.isPending}>
                    {login.isPending ? "Logging in..." : "Login"}
                </button>
                        {login.error && (
                    <p style={{ color: "red" }}>
                        {login.error.message || "Login failed"}
                    </p>
                )}
            </form>
        </div>
	);
};

export default Login;
