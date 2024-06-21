import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { CloudinaryModule } from '@/providers/cloudinary/cloudinary.module';
import { TagsController } from '@/models/tags/tags.controller';
import { TagsService } from '@/models/tags/tags.service';
import { Tag, TagSchema } from '@/models/tags/schemas/tag.schema';
import { User, UserSchema } from '@/models/users/schemas/user.schema';
import { CacheManagerModule } from '@/providers/cache/redis/cache.module';
import { JwtService } from '@nestjs/jwt';

@Module({
     imports: [
          MongooseModule.forFeature([
               { name: Tag.name, schema: TagSchema },
               { name: User.name, schema: UserSchema },
          ]),

          CacheManagerModule,
          CloudinaryModule,
     ],

     controllers: [TagsController],
     providers: [TagsService, JwtService],
     exports: [TagsService]
})

export class TagsModule {};