import { Injectable } from '@nestjs/common';
import { UploadApiErrorResponse, UploadApiResponse, v2 } from 'cloudinary';
import { ReadStream } from 'fs';
@Injectable()
export class CloudinaryService {
  /**get public id from cloudinary url */
  getPublicId = (imageURL) => imageURL.split('/').pop().split('.')[0];

  async uploadImage(
    stream: ReadStream,
    folderName: string,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    return new Promise((resolve, reject) => {
      const upload = v2.uploader.upload_stream(
        { folder: folderName },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        },
      );
      stream.pipe(upload);
    });
  }

  async deleteImage(folderName, public_id) {
    return await v2.uploader.destroy(`${folderName}/${public_id}`);
  }
}
