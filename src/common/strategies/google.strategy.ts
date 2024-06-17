import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile, VerifyCallback } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';
import { CloudinaryService } from '@/providers/cloudinary/cloudinary.service';
import { AuthService } from '@/authentication/auth.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
     constructor(
          private readonly authService: AuthService,
          private readonly cloudinaryService: CloudinaryService,
          private readonly configService: ConfigService,
     ) {
          super({
              clientID: configService.get('GOOGLE_CLIENT_ID'),
              clientSecret: configService.get('GOOGLE_CLIENT_SECRET'),
              callbackURL: configService.get('GOOGLE_CLIENT_URL'),
              scope: ['email', 'profile'],
          });
     };

     async validate(accessToken: string, refreshToken: string, profile: Profile, done: VerifyCallback): Promise<void> {

          const avatar = await this.cloudinaryService.uploadAvatar(profile.photos[0].value);
          const user = {
               name: profile._json.given_name,
               username: profile.displayName,
               email: profile.emails[0].value,
               provider: profile.provider,
               google_id: profile.id,
               avatar: avatar,
          };

          await this.authService.validateSocialUser(user, 'google');

          done(null, user);
     };
};