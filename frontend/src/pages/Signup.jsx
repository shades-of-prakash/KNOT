// ✅ Signup.jsx (frontend)
import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate, Link } from "react-router";
import logoBlack from "../assets/logo-black.png";
import Mesh from "../assets/mesh.jpg";
import { HugeiconsIcon } from "@hugeicons/react";
import { ViewIcon, ViewOffSlashIcon } from "@hugeicons/core-free-icons";

const Signup = () => {
	const [username, setUsername] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [isConfirmValid, setIsConfirmValid] = useState(true);
	const [successMessage, setSuccessMessage] = useState("");
	const [step, setStep] = useState("signup");
	const [otp, setOtp] = useState("");
	const [registeredEmail, setRegisteredEmail] = useState("");

	const { register } = useAuth();
	const navigate = useNavigate();

	useEffect(() => {
		const timer = setTimeout(() => {
			if (confirmPassword !== "") {
				setIsConfirmValid(password === confirmPassword);
			}
		}, 300);
		return () => clearTimeout(timer);
	}, [password, confirmPassword]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (password !== confirmPassword) return;
		try {
			const res = await register.mutateAsync({ username, email, password });
			setSuccessMessage(res.message);
			setRegisteredEmail(email);
			setStep("otp");
		} catch (_) {
			setSuccessMessage("");
		}
	};

	const handleOtpSubmit = async (e) => {
		e.preventDefault();
		try {
			const res = await fetch("/api/v1/auth/verify-otp", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email: registeredEmail, otp }),
			});
			const data = await res.json();
			if (res.ok) {
				localStorage.setItem("token", data.token); // ✅ Save token
				navigate("/");
				window.location.reload(); // ✅ Optional: ensures AuthContext refreshes `me`
			} else {
				setSuccessMessage(data.error || "OTP verification failed");
			}
		} catch (err) {
			setSuccessMessage("Error verifying OTP");
		}
	};

	return (
		<div className="w-screen h-dvh overflow-hidden flex items-center justify-center relative">
			<div className="absolute inset-0 w-full h-full overflow-hidden">
				<img src={Mesh} alt="" className="w-full h-full object-cover" />
			</div>
			<div className="border-2 border-violet-600/30 z-10 bg-[#FAF9F6] w-[500px] h-auto py-10 gap-6 rounded-2xl shadow-[0px_4px_6px_0px_rgba(0,_0,_0,_0.1)] flex flex-col items-center justify-center">
				<div className="flex flex-col justify-center items-center gap-4 mb-2">
					<div className="w-[100px] h-[100px] flex items-center justify-center">
						<img src={logoBlack} alt="Logo" />
					</div>
					<p className="text-center px-4">
						Knot: where thoughts are tied, not lost.
					</p>
				</div>

				<div className="w-full flex items-center justify-center">
					<div className="w-[80%]">
						{step === "signup" ? (
							<form onSubmit={handleSubmit} className="flex flex-col gap-4">
								<input
									type="text"
									placeholder="Username"
									value={username}
									onChange={(e) => setUsername(e.target.value)}
									required
									className="w-full bg-transparent p-4 rounded-full border border-black/50 focus:outline-none focus:border-2 focus:border-violet-600"
								/>
								<input
									type="email"
									placeholder="Email"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
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
										<HugeiconsIcon
											icon={showPassword ? ViewOffSlashIcon : ViewIcon}
										/>
									</div>
								</div>
								<div className="w-full relative">
									<input
										type={showPassword ? "text" : "password"}
										placeholder="Confirm Password"
										value={confirmPassword}
										onChange={(e) => setConfirmPassword(e.target.value)}
										required
										className={`w-full bg-transparent p-4 rounded-full border ${
											isConfirmValid
												? "border-black/50 focus:border-violet-600"
												: "border-red-500 focus:border-red-500"
										} focus:outline-none focus:border-2`}
									/>
								</div>
								{confirmPassword && !isConfirmValid && (
									<p className="text-red-500 text-sm px-2">
										Passwords do not match
									</p>
								)}
								<button
									type="submit"
									disabled={register.isPending}
									className="bg-violet-600 p-4 rounded-full text-white mt-2"
								>
									{register.isPending ? "Registering..." : "Sign Up"}
								</button>
								{register.error && (
									<p className="text-red-500 text-center mt-2">
										{register.error.message || "Signup failed"}
									</p>
								)}
								<p className="text-sm text-center text-black/70 mt-2">
									Already have an account?{" "}
									<Link to="/login" className="text-violet-600 underline">
										Login
									</Link>
								</p>
							</form>
						) : (
							<form onSubmit={handleOtpSubmit} className="flex flex-col gap-4">
								<h2 className="text-xl font-semibold text-violet-700">
									Enter the OTP sent to {registeredEmail}
								</h2>
								<input
									type="text"
									placeholder="Enter OTP"
									value={otp}
									onChange={(e) => setOtp(e.target.value)}
									className="w-full bg-transparent p-4 rounded-full border border-black/50 focus:outline-none focus:border-2 focus:border-violet-600"
									required
								/>
								<button
									type="submit"
									className="bg-violet-600 p-4 rounded-full text-white mt-2"
								>
									Verify OTP
								</button>
							</form>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default Signup;
