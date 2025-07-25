import jwt from "jsonwebtoken";

const protect = (req, res, next) => {
	const authHeader = req.headers.authorization;

	if (!authHeader || !authHeader.startsWith("Bearer ")) {
		return res.status(401).json({ error: "No token provided" });
	}

	const token = authHeader.split(" ")[1];

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		req.user = decoded; // decoded = { id: userId, iat, exp }
		next();
	} catch (err) {
		console.error("JWT Error:", err);
		return res.status(401).json({ error: "Token is invalid or expired" });
	}
};

export default protect;
