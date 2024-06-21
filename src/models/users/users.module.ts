import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';

import { UsersController } from '@/models/users/users.controller';
import { UsersService } from '@/models/users/users.service';
import { MailsService } from '@/providers/mails/mails.service';
import { User, UserSchema } from '@/models/users/schemas/user.schema';
import { CloudinaryModule } from '@/providers/cloudinary/cloudinary.module';
import { CacheManagerModule } from '@/providers/cache/redis/cache.module';

@Module({
     imports: [
          MongooseModule.forFeature([
               { name: User.name, schema: UserSchema },
          ]),

          CacheManagerModule,
          CloudinaryModule,
     ],

     controllers: [UsersController],
     providers: [UsersService, MailsService, JwtService],
     exports: [UsersService]
})

export class UsersModule {};