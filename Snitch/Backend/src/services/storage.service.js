import ImageKit, { toFile } from "@imagekit/nodejs";
import { config } from "../config/config.js";

/**
 * Initialize ImageKit Client using the private API key.
 * The official @imagekit/nodejs SDK only requires the privateKey for server-side uploads.
 */
const client = new ImageKit({
  privateKey: config.IMAGEKIT_PRIVATE_KEY,
});

/**
 * Upload a file buffer (e.g. from multer) to ImageKit.
 * @param {Buffer} buffer - The file buffer in memory
 * @param {string} originalname - The original filename
 * @param {string} [folder] - Optional destination folder in ImageKit DAM
 * @returns {Promise<{ url: string, fileId: string, name: string }>}
 */
export async function uploadToImageKit(buffer, originalname, folder = "/snitch/products") {
  try {
    const fileName = `${Date.now()}-${originalname.replace(/\s+/g, "-")}`;
    const file = await toFile(buffer, fileName);

    const response = await client.files.upload({
      file,
      fileName,
      folder,
    });

    return {
      url: response.url,
      fileId: response.fileId,
      name: response.name,
    };
  } catch (error) {
    console.error("ImageKit Upload Error:", error);
    throw new Error(error?.message || "Failed to upload image to ImageKit");
  }
}

export default {
  client,
  uploadToImageKit,
};
