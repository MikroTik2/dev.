import { IsString, MaxLength, MinLength, IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
     
     @IsNotEmpty()
     @IsString()
     @IsEmail()
     @MaxLength(40)
     @ApiProperty({ description: 'Email address of the user', maximum: 40, example: 'john.doe@example.com' })
     email: string;

     @IsNotEmpty()
     @IsString()
     @MinLength(3)
     @MaxLength(30)
     @ApiProperty({ description: 'Password of the user', minimum: 3, maximum: 30, example: 'StrongPassword123' })
     password: string;
};