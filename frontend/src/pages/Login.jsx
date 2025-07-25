import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate, Link } from "react-router";
import logoBlack from "../assets/logo-black.png";
import Mesh from "../assets/mesh.jpg"; // Ensure extension is correct
import { HugeiconsIcon } from "@hugeicons/react";
import { ViewIcon, ViewOffSlashIcon } from "@hugeicons/core-free-icons";

const Login = () => {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const { login } = useAuth();
	const navigate = useNavigate();
	const [showPassword, setShowPassword] = useState(false);

	const handleSubmit = async (e) => {
		e.preventDefault();
		console.log(username);
		console.log(password);
		try {
			await login.mutateAsync({ username, password });
			navigate("/");
		} catch (_) {}
	};

	return (
		<div className="w-screen h-dvh overflow-hidden flex items-center justify-center relative">
			<div className="absolute inset-0 w-full h-full overflow-hidden">
				<img src={Mesh} alt="" className="w-full h-full object-cover" />
			</div>
			<div className="border-2 border-violet-600/30 z-10 bg-[#FAF9F6] w-[500px] h-[600px] gap-6 rounded-2xl shadow-[0px_4px_6px_0px_rgba(0,_0,_0,_0.1)] flex flex-col items-center justify-center">
				<div className="flex flex-col justify-center items-center gap-4 mb-2">
					<div className="w-[100px] h-[100px] flex items-center justify-center">
						<img src={logoBlack} alt="" />
					</div>
					<p className="">Knot: where thoughts are tied, not lost.</p>
				</div>
				<div className="w-full flex items-center justify-center">
					<div className="w-[80%]">
						<form onSubmit={handleSubmit} className="flex flex-col gap-6">
							<input
								type="text"
								placeholder="Username"
								value={username}
								onChange={(e) => setUsername(e.target.value)}
								required
								className="w-full bg-transparent p-4 rounded-full border border-black/50 focus:outline-none focus:border-2 focus:border-violet-600"
							/>
							<div className="w-full relative">
								<input
									type={showPassword ? "text" : "password"}
									placeholder="Password"
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									required
									className="w-full bg-transparent p-4 rounded-full border border-black/50 focus:outline-none focus:border-2 focus:border-violet-600"
								/>
								<div
									className="absolute top-4 right-5 cursor-pointer"
									onClick={() => setShowPassword((prev) => !prev)}
								>
									{showPassword ? (
										<HugeiconsIcon icon={ViewOffSlashIcon} />
									) : (
										<HugeiconsIcon icon={ViewIcon} />
									)}
								</div>
							</div>
							<button
								type="submit"
								disabled={login.isPending}
								className="bg-violet-600 p-4 rounded-full text-white"
							>
								{login.isPending ? "Logging in..." : "Login"}
							</button>
							{login.error && (
								<p className="text-red-500 text-center">
									{login.error.message || "Login failed"}
								</p>
							)}
							<p className="text-sm text-center text-black/70">
								Don’t have an account?{" "}
								<Link to="/signup" className="text-violet-600 underline">
									Sign up
								</Link>
							</p>
						</form>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Login;
