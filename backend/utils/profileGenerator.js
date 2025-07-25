import { supabase } from "../config/supabaseClient.js";

export const getRandomProfilePic = async () => {
	const { data, error } = await supabase.storage
		.from("knot")
		.list("profiles", { limit: 100 });

	if (error) {
		throw new Error("Failed to list profile images: " + error.message);
	}

	const profilePics = (data || [])
		.filter((file) => file.name && !file.name.endsWith("/"))
		.map((file) => {
			const { data: publicUrlData } = supabase.storage
				.from("knot")
				.getPublicUrl(`profiles/${file.name}`);

			return publicUrlData.publicUrl;
		});

	if (profilePics.length === 0) {
		throw new Error("No profile images found in Supabase Storage.");
	}

	const randomIndex = Math.floor(Math.random() * profilePics.length);
	return profilePics[randomIndex];
};
