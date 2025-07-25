import jwt from "jsonwebtoken";
import crypto from "crypto";
import nodemailer from "nodemailer";
import { User } from "../models/user.js";
import { Post } from "../models/post.js";
import dotenv from "dotenv";
import { getRandomProfilePic } from "../utils/profileGenerator.js";

dotenv.config();

const createToken = (id) => {
	return jwt.sign({ id }, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRES_IN,
	});
};
const sendOtpEmail = async (email, otp) => {
	const transporter = nodemailer.createTransport({
		service: "gmail",
		auth: {
			user: process.env.EMAIL_USER,
			pass: process.env.EMAIL_PASS,
		},
	});

	await transporter.sendMail({
		from: `"Knot" <${process.env.EMAIL_USER}>`,
		to: email,
		subject: "Your OTP for Knot verification",
		html: `
      <div style="font-family: sans-serif; line-height: 1.5; padding: 20px;">
        <h2>🔐 Knot Verification Code</h2>
        <p>Use the OTP below to verify your account:</p>
        <div style="font-size: 24px; font-weight: bold; margin: 10px 0;">${otp}</div>
        <p>This OTP is valid for 10 minutes. If you did not request this, ignore this email.</p>
      </div>
    `,
	});
};

const generateOTP = () =>
	Math.floor(100000 + Math.random() * 900000).toString();

export const register = async (req, res) => {
	const { username, email, password } = req.body;
	try {
		const existingUser = await User.findOne({ $or: [{ username }, { email }] });

		if (existingUser) {
			if (!existingUser.isVerified) {
				existingUser.otp = generateOTP();
				existingUser.password = password;
				await existingUser.save();

				await sendOtpEmail(email, existingUser.otp);
				return res.status(200).json({ message: "OTP resent to your email." });
			}
			return res.status(400).json({ error: "Username or email already taken" });
		}

		const otp = generateOTP();
		const profilePic = await getRandomProfilePic();

		const user = await User.create({
			username,
			email,
			password,
			isVerified: false,
			otp,
			profilePic,
		});

		await sendOtpEmail(email, otp);

		res.status(201).json({ message: "OTP sent to your email. Please verify." });
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "Server error during registration" });
	}
};

export const verifyOtp = async (req, res) => {
	const { email, otp } = req.body;
	try {
		const user = await User.findOne({ email });

		if (!user) return res.status(400).json({ error: "User not found" });

		if (user.otp !== otp) return res.status(400).json({ error: "Invalid OTP" });
		user.isVerified = true;
		user.otp = undefined;
		await user.save();
		const token = createToken(user._id);
		res.status(200).json({
			message: "Account verified",
			token,
			user: { id: user._id, username: user.username },
		});
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "OTP verification failed" });
	}
};
// LOGIN

export const login = async (req, res) => {
	const { username, password } = req.body;

	try {
		const user = await User.findOne({ username });
		if (!user || !(await user.comparePassword(password))) {
			return res.status(401).json({ error: "Invalid credentials" });
		}

		if (!user.isVerified) {
			return res.status(403).json({ error: "Please verify your email first" });
		}

		const token = createToken(user._id);
		res
			.status(200)
			.json({ token, user: { id: user._id, username: user.username } });
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "Server error during login" });
	}
};

// GET CURRENT USER
export const getCurrentUser = async (req, res) => {
	try {
		const user = await User.findById(req.user.id).select("-password");
		if (!user) return res.status(404).json({ error: "User not found" });

		res.status(200).json({
			user: {
				id: user._id,
				username: user.username,
				email: user.email,
				profilePic: user.profilePic,
			},
		});
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "Failed to fetch user" });
	}
};

export const getUserProfileWithPosts = async (req, res) => {
	console.log(req.user);
	try {
		const user = await User.findById(req.user.id).select("username email");
		if (!user) return res.status(404).json({ error: "User not found" });

		const posts = await Post.find({ user: user.id })
			.sort({ createdAt: -1 })
			.populate("comments.user", "username");

		res.status(200).json({ user, posts });
	} catch (err) {
		console.error("[getUserProfileWithPosts]", err);
		res.status(500).json({ error: "Server error" });
	}
};

export const uploadProfilePic = async (req, res) => {
	try {
		if (!req.file) {
			return res.status(400).json({ error: "No file uploaded" });
		}

		const userId = req.user.id;
		const file = req.file;
		const filename = `profiles/${userId}_${Date.now()}_${file.originalname}`;

		// Upload to Firebase Storage
		const fileUpload = bucket.file(filename);

		const blobStream = fileUpload.createWriteStream({
			metadata: {
				contentType: file.mimetype,
				metadata: {
					firebaseStorageDownloadTokens: uuidv4(), // needed for public access
				},
			},
		});

		blobStream.on("error", (err) => {
			console.error("Upload error:", err);
			return res.status(500).json({ error: "Upload failed" });
		});

		blobStream.on("finish", async () => {
			const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${
				bucket.name
			}/o/${encodeURIComponent(fileUpload.name)}?alt=media&token=${
				fileUpload.metadata.metadata.firebaseStorageDownloadTokens
			}`;

			// Update user's profilePic in DB
			const user = await User.findById(userId);
			user.profilePic = publicUrl;
			await user.save();

			res.status(200).json({
				message: "Profile picture updated",
				profilePic: publicUrl,
			});
		});

		blobStream.end(file.buffer);
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "Server error during upload" });
	}
};
