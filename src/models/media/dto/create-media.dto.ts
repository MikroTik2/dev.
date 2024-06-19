import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty, IsArray } from "class-validator";

export class CreateMediaDto {
            
            @ApiProperty({ description: 'This is title Media', example: 'hleloo' })
            @IsNotEmpty()
            @IsString()
            title: string;

            @ApiProperty({ description: 'This is content Media', example: 'hleloo' })
            @IsNotEmpty()
            @IsString()
            content: string;

            @ApiProperty({ description: 'This is content html section Media', example: 'hleloo' })
            @IsNotEmpty()
            @IsString()
            content_html: string;

            @ApiProperty({ description: 'This is category Media', example: 'JavaScript' })
            @IsNotEmpty()
            @IsString()
            categories: string;

            @ApiProperty({ description: 'This is tags Media', example: 'JavaScript' })
            @IsNotEmpty()
            @IsArray()
            tags?: string[];

            @ApiProperty({ description: 'This is summary Media', example: 'sfsdfsdf' })
            @IsNotEmpty()
            @IsString()
            summary: string;
       
            @ApiProperty({ description: 'This is slug from title Media', example: 'sdfsdf-sdfsdfsdf' })
            @IsNotEmpty()
            @IsString()
            slug: string;

            @ApiProperty({ description: 'This is video Media', example: 'sdfsdf-sdfsdfsdf' })
            @IsNotEmpty()
            @IsString()
            video: string;
};