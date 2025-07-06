import React, { useRef } from "react";
import Navbar from "../Navbar";
import { Outlet } from "react-router";
import Sidebar from "../Sidebar";
import CreatePost from "../CreatePost";

const MainLayout = () => {
	const dialogRef = useRef(null);

	const openDialog = () => {
		dialogRef.current?.showModal();
	};

	return (
		<div className="relative w-screen h-screen overflow-hidden">
			<Navbar onCreatePost={openDialog} />
			<div className="flex w-full h-[calc(100%-3.75rem)]">
				<Sidebar />
				<div className="w-[calc(100%-16rem)] h-full bg-primary">
					<Outlet />
				</div>
			</div>
			<CreatePost dialogRef={dialogRef} />
		</div>
	);
};

export default MainLayout;
