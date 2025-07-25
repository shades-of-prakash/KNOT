import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";

const VerifyEmail = () => {
	const navigate = useNavigate();
	const [status, setStatus] = useState("Verifying your email...");
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const token = new URLSearchParams(window.location.search).get("token");

		if (!token) {
			setStatus("❌ Invalid or missing token.");
			setLoading(false);
			return;
		}

		const verify = async () => {
			try {
				const res = await fetch(`/api/v1/auth/verify-email?token=${token}`);
				const data = await res.json();

				if (!res.ok) {
					throw new Error(data.error || "Verification failed");
				}

				setStatus("✅ Email verified successfully! Redirecting to login...");
				setTimeout(() => navigate("/login"), 2000);
			} catch (err) {
				setStatus(err.message);
			} finally {
				setLoading(false);
			}
		};

		verify();
	}, [navigate]);

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-50">
			<div className="text-center space-y-4 p-6 rounded-xl shadow-md bg-white">
				{loading ? (
					<div>
						<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-violet-600 mx-auto mb-4"></div>
						<p className="text-gray-700">{status}</p>
					</div>
				) : (
					<p className="text-lg font-medium">{status}</p>
				)}
			</div>
		</div>
	);
};

export default VerifyEmail;
