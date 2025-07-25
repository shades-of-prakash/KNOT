// components/TopPosts.jsx
import React from "react";
import { useQuery } from "@tanstack/react-query";
import PostCard from "./Post";

const fetchTopPosts = async () => {
	const res = await fetch("/api/v1/posts?sort=top");
	const data = await res.json();
	if (!res.ok) throw new Error(data.error || "Failed to fetch posts");
	return data.posts;
};

const TopPosts = () => {
	const {
		data: posts,
		isLoading,
		isError,
		error,
	} = useQuery({
		queryKey: ["top-posts"],
		queryFn: fetchTopPosts,
	});

	if (isLoading)
		return <div className="text-white p-4">Loading top posts...</div>;

	if (isError)
		return <div className="text-red-500 p-4">Error: {error.message}</div>;

	if (!posts?.length)
		return <div className="text-white p-4">No top posts yet.</div>;

	return (
		<div className="p-4 space-y-2 text-white">
			<h1 className="text-2xl font-bold mb-4">🔥 Top Posts</h1>
			{posts.map((post) => (
				<PostCard key={post._id} post={post} />
			))}
		</div>
	);
};

export default TopPosts;
