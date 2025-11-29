import { Injectable } from '@nestjs/common';
import { UploadApiResponse, v2 } from 'cloudinary';
import { v2 as cloudinary } from 'cloudinary';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ImageUploadService {
  private readonly cloudinaryName: string;
  private readonly cloudinaryApiKey: string;
  private readonly cloudinaryApiSecret: string;

  constructor(private configService: ConfigService) {
    this.cloudinaryName = this.configService.get<string>('CLOUDINARY_NAME')!;
    this.cloudinaryApiKey =
      this.configService.get<string>('CLOUDINARY_API_KEY')!;
    this.cloudinaryApiSecret = this.configService.get<string>(
      'CLOUDINARY_API_SECRET',
    )!;

    cloudinary.config({
      cloud_name: this.cloudinaryName,
      api_key: this.cloudinaryApiKey,
      api_secret: this.cloudinaryApiSecret,
    });
  }

  async uploadImage(file: Express.Multer.File): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      const upload = cloudinary.uploader.upload_stream(
        { folder: 'profile_pictures' },
        (error, result) => {
          if (error) return reject(error);
          if (!result)
            return reject(
              new Error('Upload failed: no result returned from Cloudinary'),
            );
          resolve(result);
        },
      );

      upload.end(file.buffer);
    });
  }
}
