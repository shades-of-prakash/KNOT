import React from "react";
import { House, TrendingUp } from "lucide-react";
import { Link, useLocation } from "react-router";
import { SiReact, SiGo } from "@icons-pack/react-simple-icons";
const Sidebar = () => {
	const location = useLocation();
	const currentPath = location.pathname.split("/")[1];
	console.log(currentPath);
	return (
		<div className="h-full w-64 bg-primary border-r border-border text-secondary flex  flex-col p-4">
			<div className="h-auto  w-full flex flex-col gap-1">
				<SidebarItem
					icon={<House strokeWidth={1} />}
					title="Home"
					to=""
					active={currentPath == ""}
				/>
				<SidebarItem
					icon={<TrendingUp />}
					title="Popular"
					to="popular"
					active={currentPath == "popular"}
				/>
			</div>
			<div className="h-auto  w-full flex flex-col gap-1">
				<p className="text-sm py-2 px-1  text-zinc-600">Languages</p>
				<SidebarItem
					icon={<SiReact />}
					title="React"
					to="react"
					active={currentPath == "react"}
				/>
				<SidebarItem
					icon={<SiGo />}
					title="Go"
					to="go"
					active={currentPath == "go"}
				/>
			</div>
		</div>
	);
};

const SidebarItem = ({ icon, title, to, active = false }) => {
	console.log(icon, title, to, active);
	const baseClasses = "h-10 p-2 rounded-md flex items-center gap-2";
	const activeClasses = "border border-border bg-accent text-primary";
	const inactiveClasses = "hover:bg-zinc-900";

	return (
		<Link
			to={to}
			className={`${baseClasses} ${active ? activeClasses : inactiveClasses}`}
		>
			{icon}
			<span>{title}</span>
		</Link>
	);
};

export default Sidebar;
