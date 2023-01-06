import { Injectable } from '@nestjs/common';
import { FileUpload } from 'graphql-upload';
import { customError } from 'src/common/errors';
import { FILE_CODE, FILE_TYPE_CODE } from 'src/common/errors/error.code';
import { FILE_TYPE_MESSAGE } from 'src/common/errors/error.message';
import { STATUS_CODE } from 'src/common/errors/error.statusCode';
import { CloudinaryService } from 'src/modules/cloudinary/services/cloudinary.service';
import { imageRegex } from '../extensions/file.extension';
import { ApolloError } from 'apollo-server-express';

@Injectable()
export class FileUploadService {
  constructor(private cloudinary: CloudinaryService) {}

  async uploadHandler(image, folderName) {
    try {
      const { createReadStream, filename } = await image;
      /**check file extension */
      if (!imageRegex.exec(filename))
        throw new ApolloError(
          FILE_TYPE_MESSAGE.NOT_SUPPORTED,
          FILE_TYPE_CODE.NOT_SUPPORTED,
          {
            statusCode: STATUS_CODE.NOT_FOUND,
          },
        );

      const stream = createReadStream();
      const cloudinaryResponse = await this.cloudinary.uploadImage(
        stream,
        folderName,
      );
      return cloudinaryResponse.secure_url;
    } catch (err) {
      throw new ApolloError(err?.message, err?.extensions?.code, {
        statusCode: err?.extensions?.statusCode,
      });
    }
  }

  async uploadImage(
    folderName: string,
    file: FileUpload[] | FileUpload,
  ): Promise<any> {
    try {
      /**if single file */
      if (!Array.isArray(file))
        return await this.uploadHandler(file, folderName);
      /**if array of files */
      return await Promise.all(
        file.map(async (image: FileUpload): Promise<any> => {
          return await this.uploadHandler(image, folderName);
        }),
      );
    } catch (err) {
      throw new ApolloError(err?.message, err?.extensions?.code, {
        statusCode: err?.extensions?.statusCode,
      });
    }
  }

  async deleteImage(folderName, public_id) {
    return await this.cloudinary.deleteImage(folderName, public_id);
  }
}
