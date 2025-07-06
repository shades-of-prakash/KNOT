import React from "react";
import LogoWhite from "../assets/logo-white.png";
import { Link } from "react-router";
import { useAuth } from "../contexts/AuthContext";

const Navbar = ({ onCreatePost }) => {
	const { user, logout } = useAuth();

	return (
		<div className="w-full h-18 bg-primary border-b border-border text-secondary flex justify-between items-center px-6">
			{/* Left section: Logo */}
			<div className="flex items-center gap-2 h-full">
				<img src={LogoWhite} alt="Knot Logo" className="w-9 h-9" />
				<h1 className="text-2xl font-inter font-semibold">Knot</h1>
			</div>

			{/* Right section: User or Auth buttons */}
			<div className="flex items-center gap-4">
				{user ? (
					<>
						<span className="text-lg font-medium">Hello, {user.username}</span>
						<button
							onClick={logout}
							className="bg-red-600 text-white px-4 py-2 rounded"
						>
							Logout
						</button>
						<button
							onClick={onCreatePost}
							className="bg-green-600 text-white px-4 py-2 rounded"
						>
							Create Post
						</button>
					</>
				) : (
					<>
						<Link
							to="/login"
							className="bg-violet-600 text-white px-4 py-2 rounded"
						>
							Login
						</Link>
					</>
				)}
			</div>
		</div>
	);
};

export default Navbar;
