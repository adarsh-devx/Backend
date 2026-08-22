const ImageKit = require('@imagekit/nodejs');

const client = new ImageKit({
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

const uploadFile = async (buffer, filename, folder = "") => {
  if (!buffer || !filename) {
    throw new Error("Invalid file provided");
  }

  try {
    const base64 = Buffer.isBuffer(buffer) ? buffer.toString("base64") : buffer;
    const file = await client.files.upload({
      file: base64,
      fileName: filename,
      folder,
    });
    return file;
  } catch (error) {
    console.error("ImageKit upload failed:", error);
    throw new Error("Failed to upload file to storage service");
  }
};

module.exports = { uploadFile };
