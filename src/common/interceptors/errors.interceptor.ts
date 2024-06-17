import { Injectable, NestInterceptor, ExecutionContext, BadRequestException, CallHandler } from "@nestjs/common";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";

@Injectable()
export class ErrorsInterceptor implements NestInterceptor {
            intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
                        return next.handle().pipe(
                                    catchError((err) => {
                                        let errorMessage = 'An unexpected error occurred';
                                        if (err && err.message) {
                                                errorMessage = err.message;
                                        };
                        
                                        if (err.name === 'CastError' && err.kind === 'ObjectId') {
                                            errorMessage = `Invalid ObjectId format: ${err.value}`;
                                        };
                        
                                        return throwError(() => new BadRequestException(errorMessage));
                                    }),
                        );
            };
};