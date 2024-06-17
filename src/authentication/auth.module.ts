import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { AuthService } from '@/authentication/auth.service';
import { CloudinaryModule } from '@/providers/cloudinary/cloudinary.module';
import { AuthController } from '@/authentication/auth.controller';
import { MailsModule } from '@/providers/mails/mails.module';
import { GoogleOauthGuard } from '@/common/guards/google-oauth.guard';
import { GoogleStrategy } from '@/common/strategies/google.strategy';
import { GithubOauthGuard } from '@/common/guards/github-oauth.guard';
import { Githubtrategy } from '@/common/strategies/github.strategy';

import { User, UserSchema } from '@/models/users/schemas/user.schema';
import { UsersModule } from '@/models/users/users.module';

@Module({
     imports: [
          JwtModule.register({
               secret: process.env.JWT_SECRET_KEY,
                    signOptions: { expiresIn: process.env.JWT_EXPIRATION_TIME },
          }),
          
          MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
          ConfigModule.forRoot(),

          MailsModule,
          CloudinaryModule,
          UsersModule,
     ],

     controllers: [AuthController],
     providers: [AuthService, GoogleStrategy, GoogleOauthGuard, GithubOauthGuard, Githubtrategy, JwtAuthGuard],
     exports: [AuthService], 
})

export class AuthModule {};