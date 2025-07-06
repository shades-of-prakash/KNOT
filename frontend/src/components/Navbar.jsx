import React from "react";
import LogoWhite from "../assets/logo-white.png";
import { Link } from "react-router";

const Navbar = () => {
	return (
		<div className="w-full h-18 bg-primary border-b border-border text-secondary flex justify-between items-center">
			<div className="flex items-center gap-2 h-full p-6">
				<img src={LogoWhite} alt="" className="w-9 h-9" />
				<h1 className="text-2xl font-inter font-semibold">Knot</h1>
			</div>
			<div className="px-2">
				<Link to="login" className="bg-violet-600 px-4 py-2">
					Login
				</Link>
			</div>
		</div>
	);
};

export default Navbar;
