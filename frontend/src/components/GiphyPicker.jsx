import React, { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";

const GIPHY_API_KEY = "YOUR_GIPHY_API_KEY";

function GiphyPicker({ onSelect, onClose }) {
	const [search, setSearch] = useState("");
	const [results, setResults] = useState([]);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		const fetchGIFs = async () => {
			setLoading(true);
			const endpoint = search
				? `https://api.giphy.com/v1/gifs/search?q=${encodeURIComponent(search)}&api_key=${GIPHY_API_KEY}&limit=20`
				: `https://api.giphy.com/v1/gifs/trending?api_key=${GIPHY_API_KEY}&limit=20`;

			try {
				const res = await fetch(endpoint);
				const json = await res.json();
				setResults(json.data);
			} catch (err) {
				console.error("GIF fetch failed:", err);
			} finally {
				setLoading(false);
			}
		};

		fetchGIFs();
	}, [search]);

	return (
		<div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
			<div className="bg-[#121212] text-white w-[600px] h-[600px] rounded-xl shadow-lg animate-slide-in flex flex-col overflow-hidden">
				{/* Header */}
				<div className="flex items-center px-4 py-3 border-b border-gray-700">
					<button onClick={onClose} className="text-white hover:text-violet-500 mr-3">
						<ArrowLeft size={22} />
					</button>
					<h2 className="text-lg font-semibold">Choose a GIF</h2>
				</div>

				{/* Search */}
				<div className="p-4 border-b border-gray-700">
					<input
						type="text"
						placeholder="Search GIFs..."
						className="w-full px-4 py-2 rounded-md bg-[#1e1e1e] text-white border border-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-600"
						value={search}
						onChange={(e) => setSearch(e.target.value)}
					/>
				</div>

				{/* Results */}
				<div className="p-4 flex-1 overflow-y-auto">
					{loading ? (
						<p className="text-gray-400 text-center">Loading GIFs...</p>
					) : (
						<div className="grid grid-cols-2 md:grid-cols-3 gap-3">
							{results.map((gif) => (
								<img
									key={gif.id}
									src={gif.images.fixed_width.url}
									alt={gif.title}
									className="w-full h-auto rounded hover:scale-105 transition cursor-pointer bg-[#222]"
									onClick={() => {
										onSelect(gif.images.original.url);
										onClose();
									}}
									onError={(e) => (e.currentTarget.src = "/fallback.gif")}
								/>
							))}
						</div>
					)}
				</div>
			</div>
		</div>
	);
}

export default GiphyPicker;
