import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty, IsArray } from "class-validator";

export class CreateBlogDto {
            
            @ApiProperty({ description: 'This is title blog', example: 'hleloo' })
            @IsNotEmpty()
            @IsString()
            title: string;

            @ApiProperty({ description: 'This is content blog', example: 'hleloo' })
            @IsNotEmpty()
            @IsString()
            content: string;

            @ApiProperty({ description: 'This is content html section blog', example: 'hleloo' })
            @IsNotEmpty()
            @IsString()
            content_html: string;

            @ApiProperty({ description: 'This is category blog', example: 'JavaScript' })
            @IsNotEmpty()
            @IsString()
            categories: string;

            @ApiProperty({ description: 'This is tags blog', example: 'JavaScript' })
            @IsNotEmpty()
            @IsArray()
            tags: string[];

            @ApiProperty({ description: 'This is summary blog', example: 'sfsdfsdf' })
            @IsNotEmpty()
            @IsString()
            summary: string;
       
            @ApiProperty({ description: 'This is slug from title blog', example: 'sdfsdf-sdfsdfsdf' })
            @IsNotEmpty()
            @IsString()
            slug: string;

            @ApiProperty({ description: 'This is images blog', example: 'sdfsdf-sdfsdfsdf' })
            @IsNotEmpty()
            @IsString()
            images: string;
};