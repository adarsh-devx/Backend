import multer from "multer";

/**
 * Configure Multer with in-memory storage.
 * Keeps uploaded file buffer in memory (req.files / req.file)
 * so it can be directly piped into ImageKit without saving temporary files to disk.
 */
const storage = multer.memoryStorage();

export const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max file size
  },
});

export default upload;
