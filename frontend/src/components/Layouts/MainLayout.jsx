import React from "react";
import Navbar from "../Navbar";
import { Outlet } from "react-router";
import Sidebar from "../ui/Sidebar";
const MainLayout = () => {
	return (
		<div className="w-screen h-screen overflow-hidden">
			<Navbar />
			<div className="flex w-full h-[calc(100%-3.75rem)]">
				<Sidebar />
				<div className="w-[calc(100%-16rem)] h-full bg-primary">
					<Outlet />
				</div>
			</div>
		</div>
	);
};

export default MainLayout;
