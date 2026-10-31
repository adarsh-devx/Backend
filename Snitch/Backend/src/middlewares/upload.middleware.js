import multer from "multer";

/**
 * Configure Multer with in-memory storage and strict image fileFilter.
 * Keeps uploaded file buffer in memory so it can be directly piped into ImageKit.
 * Whitelists only verified image mime-types to prevent malicious binary uploads.
 */
const storage = multer.memoryStorage();

const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/jpg",
]);

const fileFilter = (req, file, cb) => {
  if (ALLOWED_MIME_TYPES.has(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        `Invalid file type (${file.mimetype}). Only JPG, PNG, and WebP images are allowed.`,
      ),
      false,
    );
  }
};

export const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max file size
  },
  fileFilter,
});

export default upload;
