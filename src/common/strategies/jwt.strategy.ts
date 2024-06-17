import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { IJwtPayload } from '@/authentication/interfaces/jwt-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
     constructor(private readonly configService: ConfigService) {
          super({
               jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
               secretOrKey: configService.get('JWT_SECRET_KEY'), 
          });
     };

     async validate(payload: IJwtPayload) {
          return { _id: payload.sub, username: payload.email };
     };
};