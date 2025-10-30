const ImageKit = require('imagekit');
import * as sharp from 'sharp';

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
  private static readonly MAX_SIZE = 3 * 1024 * 1024;
  private static readonly ALLOWED_FORMATS = ['png', 'jpg', 'jpeg', 'webp'];

  private static validateSize(buffer: Buffer): void {
    if (buffer.length > this.MAX_SIZE) {
      throw new Error('Your image is too large. Please choose an image smaller than 3MB.');
    }
  }

  private static async validateFormat(buffer: Buffer): Promise<string> {
    const metadata = await sharp(buffer).metadata();
    const format = metadata.format;

    if (!format || !this.ALLOWED_FORMATS.includes(format)) {
      throw new Error(
        `Please upload a valid image file. Supported formats: ${this.ALLOWED_FORMATS.join(', ').toUpperCase()}`,
      );
    }

    return format;
  }

  private static async convertToWebP(buffer: Buffer): Promise<Buffer> {
    return await sharp(buffer)
      .webp({ lossless: true, quality: 90 })
      .toBuffer();
  }

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
      throw new Error(`We couldn't upload your image. Please try again or choose a different image.`);
    }
  }

  static async uploadImage(
    buffer: Buffer,
    originalName: string,
    folder?: string,
  ): Promise<ImageUploadResult> {
    this.validateSize(buffer);

    const format = await this.validateFormat(buffer);

    let processedBuffer = buffer;
    let fileName = originalName;

    if (format !== 'webp') {
      processedBuffer = await this.convertToWebP(buffer);
      fileName = originalName.replace(/\.(png|jpg|jpeg)$/i, '.webp');
    }

    return await this.uploadToImageKit(processedBuffer, fileName, folder);
  }

  static async deleteImage(fileId: string): Promise<void> {
    try {
      await imagekit.deleteFile(fileId);
    } catch (error) {
      throw new Error(`We couldn't delete the image. Please try again.`);
    }
  }
}
