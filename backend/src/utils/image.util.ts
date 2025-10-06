/**
 * IMAGE UPLOAD UTILITY - ImageKit Integration
 *
 * EXPRESS EQUIVALENT: Similar utility function for image handling
 *
 * Validates image size, format, converts to WebP if needed, and uploads to ImageKit
 */

const ImageKit = require('imagekit');
import * as sharp from 'sharp';

// Initialize ImageKit instance
const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

export interface ImageUploadResult {
  url: string;
  fileId: string;
  name: string;
}

export class ImageUtil {
  private static readonly MAX_SIZE = 3 * 1024 * 1024; // 3MB in bytes
  private static readonly ALLOWED_FORMATS = ['png', 'jpg', 'jpeg', 'webp'];

  /**
   * Validate image size
   */
  private static validateSize(buffer: Buffer): void {
    if (buffer.length > this.MAX_SIZE) {
      throw new Error('Image size must be less than 3MB');
    }
  }

  /**
   * Validate and get image format
   */
  private static async validateFormat(buffer: Buffer): Promise<string> {
    const metadata = await sharp(buffer).metadata();
    const format = metadata.format;

    if (!format || !this.ALLOWED_FORMATS.includes(format)) {
      throw new Error(
        `Invalid image format. Allowed formats: ${this.ALLOWED_FORMATS.join(', ')}`,
      );
    }

    return format;
  }

  /**
   * Convert image to WebP format (lossless)
   */
  private static async convertToWebP(buffer: Buffer): Promise<Buffer> {
    return await sharp(buffer)
      .webp({ lossless: true, quality: 90 })
      .toBuffer();
  }

  /**
   * Upload image to ImageKit
   */
  private static async uploadToImageKit(
    buffer: Buffer,
    fileName: string,
    folder: string = 'easychakri',
  ): Promise<ImageUploadResult> {
    try {
      const result = await imagekit.upload({
        file: buffer,
        fileName: `${Date.now()}_${fileName}`,
        folder: folder,
      });

      return {
        url: result.url,
        fileId: result.fileId,
        name: result.name,
      };
    } catch (error) {
      throw new Error(`Failed to upload image: ${error.message}`);
    }
  }

  /**
   * Main function to handle image upload
   * Validates size, format, converts to WebP if needed, and uploads
   */
  static async uploadImage(
    buffer: Buffer,
    originalName: string,
    folder?: string,
  ): Promise<ImageUploadResult> {
    // Validate size
    this.validateSize(buffer);

    // Validate format
    const format = await this.validateFormat(buffer);

    // Convert to WebP if not already
    let processedBuffer = buffer;
    let fileName = originalName;

    if (format !== 'webp') {
      processedBuffer = await this.convertToWebP(buffer);
      fileName = originalName.replace(/\.(png|jpg|jpeg)$/i, '.webp');
    }

    // Upload to ImageKit
    return await this.uploadToImageKit(processedBuffer, fileName, folder);
  }

  /**
   * Delete image from ImageKit
   */
  static async deleteImage(fileId: string): Promise<void> {
    try {
      await imagekit.deleteFile(fileId);
    } catch (error) {
      throw new Error(`Failed to delete image: ${error.message}`);
    }
  }
}
