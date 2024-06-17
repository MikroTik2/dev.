import { MinLength, MaxLength, IsString, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUserDto {
     @ApiProperty({ description: 'Name of the user', minimum: 3, maximum: 30, example: 'John Doe' })
     @IsOptional()
     @IsString()
     @MinLength(3)
     @MaxLength(30)
     name?: string;

     @ApiPropertyOptional({
          description: 'Username of the user',
          maximum: 30,
          example: 'john_doe'
     })
     @IsOptional()
     @IsString()
     username?: string;

     @ApiPropertyOptional({
          example: {
               public_id: 'some_public_id',
               url: 'https://res.cloudinary.com/dn7gjjo2z/image/upload/v1710507774/avatars/oynxspnskdw8rvntb9o2.jpg'
          },
          description: 'The avatar of the user'
     })
     @IsOptional()
     avatar?: {
          public_id: string;
          url: string;
     };

     @ApiPropertyOptional({ description: 'The branding color for user', example: '#000000' })
     @IsOptional()
     @IsString()
     brand_color?: string;

     @ApiPropertyOptional({ description: 'The education of the user', example: 'Where did you go to school' })
     @IsOptional()
     @MaxLength(100)
     @IsString()
     education?: string;

     @ApiPropertyOptional({ description: 'The website url for user', example: 'https://example.com' })
     @IsOptional()
     urls?: [{
          value: string,
     }];
     
     @ApiPropertyOptional({ description: 'The location of the user', example: 'New York, USA' })
     @IsOptional()
     @IsString()
     @MaxLength(100)
     location?: string;

     @ApiPropertyOptional({ description: 'the bio description of the user', example: 'I am so cool' })
     @IsOptional()
     @IsString()
     @MaxLength(200)
     bio?: string;

     @ApiPropertyOptional({ description: 'the projects description of the user', example: 'These are all my projects' })
     @IsOptional()
     @MaxLength(200)
     @IsString()
     projects?: string;

     @ApiPropertyOptional({ description: 'the work of the user', example: 'What do you do Example: CEO at ACME Inc.' })
     @IsOptional()
     @MaxLength(100)
     @IsString()
     work?: string;

     @ApiPropertyOptional({ description: 'The skills of the user', example: ['HTML', 'CSS', 'JavaScript'] })
     @IsOptional()
     skills?: string;

     @ApiPropertyOptional({ description: 'the currently learning of the user', example: 'Nestjs' })
     @IsOptional()
     @IsString()
     @MaxLength(200)
     learning?: string;
};
