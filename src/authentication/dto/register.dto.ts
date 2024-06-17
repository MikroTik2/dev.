import { IsString, MinLength, MaxLength, IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {

     @IsNotEmpty()
     @IsString()
     @MinLength(3)
     @MaxLength(30)
     @ApiProperty({ description: 'Name of the user', minimum: 3, maximum: 30, example: 'John Doe' })
     name: string;

     @IsNotEmpty()
     @IsString()
     @MinLength(3)
     @MaxLength(30)
     @ApiProperty({ description: 'Username of the user', minimum: 3, maximum: 30, example: 'john_doe' })
     username: string;

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