import React from "react";
import { Button } from "./ui/Button";
import Codemare from "../assets/Codemare.svg?react";
import { Link } from "react-router";

const Navbar = () => {
	return (
		<div className="w-full h-15 bg-primary border-b border-border text-secondary flex justify-between items-center">
			<div className="flex items-center gap-2 h-full p-6">
				<Codemare className="w-6 h-6" />
				<h1 className="text-2xl font-inter font-semibold">Codemare</h1>
			</div>
			<div>
				<Link to="login" className="bg-accent px-4 py-2">
					Login
				</Link>
			</div>
		</div>
	);
};

export default Navbar;
