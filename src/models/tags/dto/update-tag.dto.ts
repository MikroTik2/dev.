import { IsNotEmpty, IsString, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateTagDto {
     @ApiProperty({ description: 'The title of the tag', example: 'Technology' })
     @IsNotEmpty()
     @IsOptional()
     @IsString()
     title?: string;

     @ApiProperty({ description: 'The description of the tag', example: 'Tags related to technology and gadgets' })
     description?: string;

     @ApiProperty({ description: 'The image URL associated with the tag', example: 'http://example.com/image.png' })
     @IsNotEmpty()
     @IsOptional()
     @IsString()
     image?: {
          public_id: string;
          url: string;
     };

     @ApiProperty({ description: 'The color code for the tag', example: '#ff5733' })
     @IsNotEmpty()
     @IsOptional()
     @IsString()
     color?: string;

     @ApiProperty({ description: 'The number of posts associated with this tag', example: 42 })
     @IsNotEmpty()
     @IsOptional()
     @IsNumber()
     posts?: number;
};
