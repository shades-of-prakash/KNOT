import React, { useEffect } from "react";
import { useLocation } from "react-router";
import { useQuery } from "@tanstack/react-query";

const fetchUserPosts = async () => {
	const token = localStorage.getItem("token");

	const res = await fetch("/api/v1/auth/me/posts", {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});

	if (!res.ok) throw new Error("Failed to fetch user posts");

	return res.json(); // { user, posts }
};

const ProfilePage = () => {
	const location = useLocation();
	const justPosted = location.state?.justPosted;

	const {
		data,
		isLoading,
		isError,
		error,
		refetch, // ⬅️ Needed to refresh posts
	} = useQuery({
		queryKey: ["my-profile"],
		queryFn: fetchUserPosts,
		refetchOnWindowFocus: false,
	});

	useEffect(() => {
		if (justPosted) {
			refetch();
		}
	}, [justPosted, refetch]);

	if (isLoading) return <div className="p-4 text-white">Loading...</div>;
	if (isError)
		return <div className="p-4 text-red-500">Error: {error.message}</div>;

	const { user, posts } = data;

	return (
		<div className="max-w-3xl mx-auto p-6 text-white">
			<h1 className="text-3xl font-bold mb-4">@{user.username}</h1>
			<p className="text-gray-400 mb-8">{user.email}</p>

			<h2 className="text-2xl font-semibold mb-4">Your Posts</h2>

			{posts.length === 0 ? (
				<p className="text-gray-400">You haven't posted anything yet.</p>
			) : (
				<div className="space-y-4">
					{posts.map((post) => (
						<div
							key={post._id}
							className="border border-gray-700 rounded-lg p-4 bg-gray-900"
						>
							<p className="text-sm text-gray-400">
								{new Date(post.createdAt).toLocaleString()}
							</p>
							<p className="text-lg mt-1">{post.content}</p>

							{post.images?.length > 0 && (
								<div className="flex gap-3 mt-3 overflow-x-auto">
									{post.images.map((img, i) => (
										<img
											key={i}
											src={img}
											alt="Post media"
											className="h-40 object-cover rounded border border-violet-500/30"
										/>
									))}
								</div>
							)}
						</div>
					))}
				</div>
			)}
		</div>
	);
};

export default ProfilePage;
