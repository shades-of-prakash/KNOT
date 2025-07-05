import multer from "multer";

// store in memory (buffer)
const storage = multer.memoryStorage();

export const upload = multer({
	storage,
	fileFilter: (req, file, cb) => {
		if (file.mimetype.startsWith("image/")) cb(null, true);
		else cb(new Error("Only image files are allowed"), false);
	},
});
