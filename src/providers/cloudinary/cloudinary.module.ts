import { Module } from '@nestjs/common';
import { CloudinaryService } from '@/providers/cloudinary/cloudinary.service';

@Module({
     providers: [CloudinaryService],
     exports: [CloudinaryService],
})

export class CloudinaryModule {};