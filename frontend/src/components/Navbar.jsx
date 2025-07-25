import React, { useState, useRef, useEffect } from "react";
import LogoWhite from "../assets/logo-white.png";
import { Link } from "react-router";
import { useAuth } from "../contexts/AuthContext";
import { HugeiconsIcon } from "@hugeicons/react";
import {
	Login02Icon,
	UserIcon,
	Settings02Icon,
} from "@hugeicons/core-free-icons";
const Navbar = ({ onCreatePost }) => {
	const { user, logout } = useAuth();
	console.log(user);
	const [isDropdownOpen, setDropdownOpen] = useState(false);
	const dropdownRef = useRef();

	useEffect(() => {
		const handleClickOutside = (e) => {
			if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
				setDropdownOpen(false);
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	return (
		<div className="w-full h-18 bg-primary border-b border-border text-secondary flex justify-between items-center px-6">
			{/* Left section: Logo */}
			<div className="flex items-center gap-2 h-full">
				<img src={LogoWhite} alt="Knot Logo" className="w-9 h-9" />
				<h1 className="text-2xl font-inter font-semibold">Knot</h1>
			</div>

			<div className="flex items-center gap-4">
				{user ? (
					<div className="relative" ref={dropdownRef}>
						<div
							className="flex items-center gap-3 hover:bg-violet-600/20 px-4 py-2 rounded-md cursor-pointer"
							onClick={() => setDropdownOpen((prev) => !prev)}
						>
							<div className={`w-8 h-8 rounded-full`}>
								<img
									src={user.profilePic}
									alt="profile pic"
									className="object-cover h-full w-full"
								/>
							</div>
							<div className="flex flex-col leading-3">
								<span className="text-sm">{user.username}</span>
								<span className="text-[10px] text-white/40">User</span>
							</div>
						</div>

						{isDropdownOpen && (
							<div className="absolute right-0 mt-2 w-50 p-2 bg-black text-white rounded-md border border-white/20 shadow-lg z-10">
								<div className="overflow-hidden whitespace-nowrap text-ellipsis text-white/60 text-sm block w-full text-left px-2 py-2 hover:bg-white/10 rounded-md">
									<span>{user.email}</span>
								</div>
								{/* <button
									onClick={onCreatePost}
									className="block w-full text-left px-4 py-2 hover:bg-gray-100"
								>
									Create Post
								</button> */}
								<div className="flex flex-col gap-2 p-1">
									<Link
										to="profile"
										className="flex gap-2 items-center text-white/60 text-sm  w-full text-left px-2 py-2 hover:bg-white/10 rounded-md"
									>
										<HugeiconsIcon icon={UserIcon} size={18} />
										<button>profile</button>
									</Link>
									<button
										onClick={onCreatePost}
										className="flex gap-2 items-center text-white/60 text-sm  w-full text-left px-2 py-2 hover:bg-white/10 rounded-md"
									>
										<HugeiconsIcon icon={Settings02Icon} size={18} />
										<button>Create post</button>
									</button>
									<Link className="flex gap-2 items-center text-white/60 text-sm  w-full text-left px-2 py-2 hover:bg-white/10 rounded-md">
										<HugeiconsIcon icon={Settings02Icon} size={18} />
										<button>Settings</button>
									</Link>

									<button
										onClick={logout}
										className="text-black flex justify-between items-center bg-white/90 hover:bg-white/60 text-sm  w-full text-left px-2 py-2  rounded-md"
									>
										<button>logout</button>
										<HugeiconsIcon icon={Login02Icon} size={18} />
									</button>
								</div>
							</div>
						)}
					</div>
				) : (
					<Link
						to="/login"
						className="bg-violet-600 text-white px-4 py-2 rounded"
					>
						Login
					</Link>
				)}
			</div>
		</div>
	);
};

export default Navbar;
