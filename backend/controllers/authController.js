import jwt from "jsonwebtoken";
import { User } from "../models/user.js";

const createToken = (id) => {
	return jwt.sign({ id }, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRES_IN,
	});
};

export const register = async (req, res) => {
	const { username, password } = req.body;

	try {
		const existingUser = await User.findOne({ username });
		if (existingUser) {
			return res.status(400).json({ error: "Username already taken" });
		}

		const user = await User.create({ username, password });
		const token = createToken(user._id);

		res.status(201).json({
			token,
			user: {
				id: user._id,
				username: user.username,
			},
		});
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "Server error during registration" });
	}
};

// Login Controller
export const login = async (req, res) => {
	const { username, password } = req.body;

	try {
		const user = await User.findOne({ username });
		if (!user || !(await user.comparePassword(password))) {
			return res.status(401).json({ error: "Invalid username or password" });
		}

		const token = createToken(user._id);
		res.status(200).json({
			token,
			user: {
				id: user._id,
				username: user.username,
			},
		});
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "Server error during login" });
	}
};

// Get Current User Controller
export const getCurrentUser = async (req, res) => {
	try {
		const user = await User.findById(req.user.id).select("-password");
		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}

		res.status(200).json({
			user: {
				id: user._id,
				username: user.username,
			},
		});
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "Failed to fetch user" });
	}
};
