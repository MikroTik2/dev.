import { IsString, MinLength, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePasswordDto {
            @ApiProperty({ description: 'Old password', example: 'currentPassword123' })
            @IsString()
            @IsNotEmpty()
            oldPassword: string;

            @ApiProperty({ description: 'New password', example: 'newPassword456' })
            @IsString()
            @IsNotEmpty()
            @MinLength(6, { message: 'Password must be at least 6 characters long' })
            password: string;

            @ApiProperty({ description: 'Confirm new password', example: 'newPassword456' })
            @IsString()
            @IsNotEmpty()
            confirmPassword: string;
};