import { Module } from '@nestjs/common';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { FileUploadService } from './services/file.service';

@Module({
  imports: [CloudinaryModule],
  providers: [FileUploadService],
  exports: [FileUploadService],
})
export class FilesModule {}
