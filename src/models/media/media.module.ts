import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MediaService } from '@/models/media/media.service';
import { MediaController } from '@/models/media/media.controller';

import { Media, MediaSchema } from '@/models/media/schemas/media.schema';
import { User, UserSchema } from '@/models/users/schemas/user.schema';
import { Tag, TagSchema } from '@/models/tags/schemas/tag.schema';

import { CloudinaryModule } from '@/providers/cloudinary/cloudinary.module';
import { CacheManagerModule } from '@/providers/cache/redis/cache.module';
import { JwtService } from '@nestjs/jwt';

@Module({  
            imports: [
                        MongooseModule.forFeature([
                                    { name: Media.name, schema: MediaSchema },
                                    { name: User.name, schema: UserSchema },
                                    { name: Tag.name, schema: TagSchema },
                        ]), 
                        
                        CloudinaryModule,
                        CacheManagerModule,
            ],

            controllers: [MediaController], 
            providers: [MediaService, JwtService],  
            exports: [MediaService]
})

export class MediaModule {};