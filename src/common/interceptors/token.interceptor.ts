import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import type { Response } from 'express';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import type { User } from '@/models/users/schemas/user.schema';

interface IToken {
            user: User,
            token: string;
};

@Injectable()
export class TokenInterceptor implements NestInterceptor {
            constructor() {};

            intercept(context: ExecutionContext, next: CallHandler<IToken>): Observable<IToken> {
                        return next.handle().pipe(
                                    map(user => {
                                                const response = context.switchToHttp().getResponse<Response>();

                                                console.log(user.user)

                                                if (!user.user.password) {
                                                            response.redirect(`http://localhost:3000/api/v2/auth/oauth?token=${user.user.confirm_token}&pass=`);
                                                            return;
                                                };

                                                response.setHeader('Authorization', `Bearer ${user.token}`);
                                                response.cookie('token', user.token, {
                                                            httpOnly: true,
                                                            secure: true,
                                                            sameSite: 'lax',
                                                });
                              
                                                return user;
                                    }),
                        );
            };
};