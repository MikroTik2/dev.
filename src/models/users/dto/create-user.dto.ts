import { MinLength, MaxLength, IsNotEmpty, IsString, IsEmail, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
     @ApiProperty({
          description: 'Name of the user',
          minimum: 3,
          maximum: 30,
          example: 'John Doe'
     })
     @IsNotEmpty()
     @IsString()
     @MinLength(3)
     @MaxLength(30)
     name: string;

     @ApiProperty({
          description: 'Username of the user',
          minimum: 3,
          maximum: 30,
          example: 'john_doe'
     })
     @IsNotEmpty()
     @IsString()
     @MinLength(3)
     @MaxLength(30)
     username: string;

     @ApiProperty({
          description: 'Email address of the user',
          maximum: 40,
          example: 'john.doe@example.com'
     })
     @IsNotEmpty()
     @IsString()
     @IsEmail()
     @MaxLength(40)
     email: string;

     @ApiProperty({
          description: 'Password of the user',
          minimum: 3,
          maximum: 30,
          example: 'StrongPassword123'
     })
     @IsNotEmpty()
     @IsString()
     @MinLength(3)
     @MaxLength(30)
     password: string;

     @IsString()
     @IsNotEmpty()
     @ApiProperty({ description: 'Token of the user for confirm your account' })
     confirm_token?: string;

     @ApiProperty({
          description: 'Role of the user',
          example: 'admin'
     })
     @IsNotEmpty()
     @IsString()
     role?: string;

     @ApiProperty({
          description: 'Indicates if the user is blocked',
          example: false
     })
     @IsNotEmpty()
     @IsBoolean()
     isBlocked?: boolean;
};