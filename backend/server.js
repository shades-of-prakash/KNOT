import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import apiRoutes from "./routes/index.js"; // import central router

dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());

connectDB();

app.use("/api/v1", apiRoutes);

app.listen(process.env.PORT, () => {
	console.log(`Server running on port ${process.env.PORT}`);
});
