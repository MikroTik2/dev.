import { Injectable } from "@nestjs/common";
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from "@nestjs/config";
import { Profile, Strategy } from "passport-github";

import { AuthService } from "@/authentication/auth.service";
import { CloudinaryService } from "@/providers/cloudinary/cloudinary.service";
import axios from 'axios';

@Injectable()
export class Githubtrategy extends PassportStrategy(Strategy, 'github') {
     constructor(
          private readonly authService: AuthService,
          private readonly cloudinaryService: CloudinaryService,
          private readonly configService: ConfigService
          ) {
          super({
               clientID: configService.get('GITHUB_CLIENT_ID'),
               clientSecret: configService.get('GITHUB_CLIENT_SECRET'),
               callbackURL: configService.get('GITHUB_CALLBACK_URL'),
               scope: ['user:email'],
          });
     };

     async validate(access_token: string, refresh_token: string, profile: Profile) {

          const request = await axios.get('https://api.github.com/user/emails', {
               headers: {
                    Authorization: `token ${access_token}`,
               },
          });

          const avatar = await this.cloudinaryService.uploadAvatar(profile.photos[0].value);

          const user = {
               name: profile.username,
               username: profile.username,
               email: request.data[0].email,
               provider: profile.provider,
               github_id: profile.id,
               avatar: avatar,
          };

          return await this.authService.validateSocialUser(user, 'github');
     };
};