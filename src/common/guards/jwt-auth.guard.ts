import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';

@Injectable()
export class JwtAuthGuard implements CanActivate {
     constructor(private readonly jwtService: JwtService) {};

     canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
          const request = context.switchToHttp().getRequest(); 
          const token = this.extractJwtFromRequest(request);

          if (!token) throw new UnauthorizedException('Missing token');

          try {

               const decoded = this.jwtService.decode(token);
               request.user = decoded;

               return true;

          } catch (err) {
               throw new UnauthorizedException('Invalid token'); 
          };
     };

     private extractJwtFromRequest(request: any): string | null {
          const { token } = request.cookies;
          return token || null;
     };
};