import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';

import { Blog, BlogSchema } from '@/models/blogs/schemas/blog.schema';
import { BlogsService } from '@/models/blogs/blogs.service';
import { BlogsController } from '@/models/blogs/blogs.controller';

import { CloudinaryModule } from '@/providers/cloudinary/cloudinary.module';
import { UsersModule } from '@/models/users/users.module';
import { User, UserSchema } from '../users/schemas/user.schema';

@Module({
     imports: [
          MongooseModule.forFeature([
               { name: Blog.name, schema: BlogSchema },
               { name: User.name, schema: UserSchema },
          ]),

          CloudinaryModule,
          UsersModule,
     ],

     controllers: [BlogsController],
     providers: [BlogsService, JwtService],
     exports: [BlogsService]
})
       
export class BlogsModule {};