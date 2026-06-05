import { v2 as cloudinary } from 'cloudinary'

// Configure Cloudinary only if the env credentials exist
if (
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  })
} else {
  console.warn('Cloudinary environment variables are missing. File uploads will fail.')
}

/**
 * Uploads a base64 image or file URI to Cloudinary.
 * @param fileUri base64 string or file path
 * @param folder Cloudinary folder name
 */
export async function uploadImage(fileUri: string, folder: string = 'listings'): Promise<string> {
  if (
    !process.env.CLOUDINARY_CLOUD_NAME ||
    !process.env.CLOUDINARY_API_KEY ||
    !process.env.CLOUDINARY_API_SECRET
  ) {
    throw new Error('Cloudinary credentials are not configured in environment variables.')
  }
  
  const result = await cloudinary.uploader.upload(fileUri, { folder })
  return result.secure_url
}
