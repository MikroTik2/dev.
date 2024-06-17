import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '@/models/users/users.service';

@Injectable()
export class RolesGuard implements CanActivate {
     constructor(
          private readonly usersService: UsersService
     ) {}

     async canActivate(context: ExecutionContext): Promise<boolean> {
          const request = context.switchToHttp().getRequest();
          const user = request.user;
     
          const findAdmin = await this.usersService.findById(user.sub);
     
          if (findAdmin.role !== 'admin') {
               throw new UnauthorizedException('You are not admin');
          } else {
               return true;
          };
     };
};