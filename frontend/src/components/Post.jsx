import React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Link } from "react-router";
import { MoreHorizontalIcon } from "@hugeicons/core-free-icons";
import timeAgo from "../utils/timeAgo";
import {
	Triangle,
	MessageSquare,
	Share2,
	ChevronsDown,
	ChevronsUp,
} from "lucide-react";

const PostCard = ({ post }) => {
	return (
		<Link
			to={`/comment-post/${post._id}`}
			state={{ post }}
			className="block w-full"
		>
			<div className="w-full font-pop bg-black border border-white/10 p-4 rounded-xl shadow-md space-y-3 hover:bg-neutral-900 transition">
				<div className="w-full py-2 flex items-center gap-2 text-sm text-gray-400">
					<div className="mt-2 w-10 h-10 flex items-center gap-1 self-start">
						<img
							src={post.user?.profilePic}
							alt="user_profile_pic"
							className="rounded-full w-10 h-10 object-cover"
						/>
					</div>
					<div className="flex flex-col flex-1 gap-2">
						<div className="w-full flex justify-between items-center leading-0">
							<div className="flex gap-1">
								<span className="text-white font-semibold">
									{post.user?.username || "Anonymous"}
								</span>
								<span>&bull;</span>
								<span className="text-neutral-600">
									{timeAgo(post.createdAt)}
								</span>
							</div>
							<div className="px-1 w-8 h-8 rounded-md hover:bg-neutral-700/30 flex items-center justify-center">
								<HugeiconsIcon icon={MoreHorizontalIcon} />
							</div>
						</div>
						<div className="text-sm text-white/80">{post.content}</div>

						{post.images?.length > 0 && (
							<div className="flex overflow-x-auto gap-4 h-[400px]">
								{post.images.map((url, i) => (
									<img
										key={i}
										src={url}
										alt="post-img"
										className="w-[500px] h-full object-cover rounded-md border border-white/20"
									/>
								))}
							</div>
						)}

						<div className="flex items-center gap-6 text-sm text-gray-300 mt-2">
							<div className="p-1 bg-neutral-600/20 text-white flex items-center gap-1 px-1 rounded-md">
								<ChevronsUp className="hover:text-green-600" />
								<span className="text-base">3k</span>
								<ChevronsDown className="hover:text-red-600" />
							</div>
							<MessageSquare size={16} strokeWidth={2} />
							<Share2 size={16} strokeWidth={2} />
						</div>
					</div>
				</div>
			</div>
		</Link>
	);
};

export default PostCard;
