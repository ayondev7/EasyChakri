export const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"]

export const MAX_FILE_SIZE_BYTES = 3 * 1024 * 1024

export const MAX_FILE_SIZE_MB = 3

export const FILE_VALIDATION_MESSAGES = {
  invalidType: "File must be JPG, JPEG, PNG, or WEBP",
  sizeTooLarge: `File must be less than ${MAX_FILE_SIZE_MB}MB`,
}
