const cloudinary = require("cloudinary").v2;
const multer = require("multer");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

/**
 * ✅ Upload PDF to Cloudinary
 * Note: We return the standard Cloudinary URL here.
 * For inline viewing, the frontend uses Google Drive Viewer.
 * 
 * @param {Buffer} fileBuffer - File data buffer
 * @param {string} originalName - Original filename (will be sanitized)
 * @param {string} folder - Cloudinary folder (e.g., 'student_placements', 'student_trainings')
 * @returns {Promise} - Cloudinary upload result
 */
async function uploadToCloudinary(fileBuffer, originalName, folder = "training_pdfs") {
  return new Promise((resolve, reject) => {
    // Remove .pdf extension if present (Cloudinary adds it automatically)
    const publicId = originalName.replace(/\.pdf$/i, "");
    
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "raw", // Required for PDFs
        public_id: publicId,
        type: "upload",
        access_mode: "public",
      },
      (error, result) => {
        if (error) {
          console.error("Cloudinary upload error:", error);
          reject(error);
        } else {
          // Return the standard secure_url
          // Frontend will wrap it in Google Drive viewer for inline viewing
          resolve(result);
        }
      }
    );
    
    stream.end(fileBuffer);
  });
}

module.exports = { upload, uploadToCloudinary };