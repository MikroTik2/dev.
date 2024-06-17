import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { v2 as cloudinary, UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';
import { CloudinaryConfig } from '@/config/cloudinary.config';

@Injectable()
export class CloudinaryService {
     constructor(private readonly configService: ConfigService) {
          cloudinary.config(configService.get<CloudinaryConfig>('cloudinary'));
     };

     private readonly options_avatar = {
          folder: 'avatars',
          width: 150,
          height: 150,
          crop: 'fill',
     };

     private readonly options_blog = {
          folder: 'blogs',
          crop: 'fill',
     };
     
     private async uploadFile(file: any, options: any): Promise<UploadApiResponse | UploadApiErrorResponse> {
          return await cloudinary.uploader.upload(file, options);
     };
  
     private async deleteFile(id: string): Promise<UploadApiResponse | UploadApiErrorResponse> {
          return await cloudinary.uploader.destroy(id, { invalidate: true });
     };

     async uploadAvatar(file: any): Promise<UploadApiResponse | UploadApiErrorResponse> {
          return this.uploadFile(file, this.options_avatar);
     };
  
     async updateAvatar(id: string, file: any): Promise<UploadApiResponse | UploadApiErrorResponse> {
          const request = await this.uploadFile(file, this.options_avatar);
          await this.deleteFile(id);

          return request;
     };
  
     async deleteAvatar(id: string): Promise<UploadApiResponse | UploadApiErrorResponse> {
          return this.deleteFile(id);
     };
  
     async uploadBlogImage(image: any): Promise<UploadApiResponse | UploadApiErrorResponse> {
          return this.uploadFile(image, this.options_blog);
     };
  
     async updateBlogImage(id: string, image: any): Promise<UploadApiResponse | UploadApiErrorResponse> {
          await this.deleteFile(id);
          return this.uploadFile(image, this.options_blog);
     };
  
     async deleteBlogImage(id: string): Promise<UploadApiResponse | UploadApiErrorResponse> {
          return this.deleteFile(id);
     };
};