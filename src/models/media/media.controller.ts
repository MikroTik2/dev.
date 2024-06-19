import { Controller, Res, HttpCode, HttpStatus, Get, Post, UseGuards, Body, Req, Param, Put, Delete, Query, UseInterceptors } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBadRequestResponse, ApiNotFoundResponse } from '@nestjs/swagger';
import { Response } from 'express';

import { Roles } from '@/common/decorators/roles.decorator';
import { RolesGuard } from '@/common/guards/roles.guard';

import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { AuthenticatedRequest } from '@/common/interfaces/authenticated-request.interface';

import { MediaService } from '@/models/media/media.service'
import { CreateMediaDto } from '@/models/media/dto/create-media.dto';
import { UpdateMediaDto } from '@/models/media/dto/update-media.dto';

import { Pagination } from '@/common/decorators/pagination.decorator';
import { IPagination } from '@/common/interfaces/pagination.interface';

import { ErrorsInterceptor } from '@/common/interceptors/errors.interceptor';
import { Media } from '@/models/media/schemas/media.schema';

@UseInterceptors(ErrorsInterceptor)
@ApiTags('Media')
@Controller('media')
export class MediaController {

            constructor(private readonly mediaService: MediaService) {};

            @Post('new')
            @UseGuards(JwtAuthGuard)
            @HttpCode(HttpStatus.CREATED)
            @ApiResponse({ status: HttpStatus.CREATED, description: 'The media has been successfully created' })
            @ApiOperation({ summary: 'Create a new media' })
            @ApiBadRequestResponse({ description: 'Invalid media data' })
            async create(@Req() request: AuthenticatedRequest, @Body() createMediaDto: CreateMediaDto): Promise<Media> {
                       return await this.mediaService.create(request.user.sub, createMediaDto);
            };

            @Get('all')
            @HttpCode(HttpStatus.OK)
            @ApiOperation({ summary: 'Get all blogs' })
            @ApiResponse({ status: HttpStatus.OK, description: 'Return all blogs', type: [Media] })
            async find(@Pagination() pagination: IPagination): Promise<Media[]> {
                        return await this.mediaService.find(pagination);
            };

            @Get('single/:value')
            @HttpCode(HttpStatus.OK)
            @ApiOperation({ summary: 'Get blog by Value' })
            @ApiNotFoundResponse({ description: 'Blog not found' })
            @ApiResponse({ status: HttpStatus.OK, description: 'Return the blog', type: Media })
            async findOne(@Param('value') value: string, @Query('table') table: string): Promise<Media> {
                        return await this.mediaService.findOne(table, value);
            };

            @Get('detail/:id')
            @HttpCode(HttpStatus.OK)
            @ApiOperation({ summary: 'Get blog by id' })
            @ApiNotFoundResponse({ description: 'Blog not found' })
            @ApiResponse({ status: HttpStatus.OK, description: 'Return the blog', type: Media })
            async findById(@Param('id') id: string): Promise<Media> {
                return await this.mediaService.findById(id);
            };

            @Get('tag/:tag')
            @HttpCode(HttpStatus.OK)
            @ApiOperation({ summary: 'Get blogs by tag' })
            @ApiResponse({ status: HttpStatus.OK, description: 'Return all blogs', type: [Media] })
            async findBlogsByTag(@Param('tag') tag: string): Promise<Media[]> {
                        return await this.mediaService.findBlogsByTag(tag);
            };

            @Get('category/:category')
            @HttpCode(HttpStatus.OK)
            @ApiOperation({ summary: 'Get blogs by category' })
            @ApiResponse({ status: HttpStatus.OK, description: 'Return all blogs', type: [Media] })
            async findBlogsByCategory(@Param('category') category: string): Promise<Media[]> {
                        return await this.mediaService.findBlogsByCategory(category);
            };

            @Get('search')
            @HttpCode(HttpStatus.OK)
            @ApiOperation({ summary: 'Search blogs' })
            @ApiResponse({ status: HttpStatus.OK, description: 'Return all blogs', type: [Media] })
            async searchBlogs(@Query('query') query: string): Promise<Media[]> {
                return await this.mediaService.searchBlogs(query);
            };

            @Put('save/:id')
            @UseGuards(JwtAuthGuard)
            @HttpCode(HttpStatus.OK)
            @ApiOperation({ summary: 'Save blog by id' })
            @ApiNotFoundResponse({ description: 'Blog not found' })
            @ApiResponse({ status: HttpStatus.OK, description: 'The blog has been successfully saved', type: Media })
            async saving(@Req() request: AuthenticatedRequest, @Param('id') id: string): Promise<any> {
                return await this.mediaService.saving(request.user.sub, id);
            };

            @Put('like/:id')
            @UseGuards(JwtAuthGuard)
            @HttpCode(HttpStatus.OK)
            @ApiOperation({ summary: 'Like blog by id' })
            @ApiNotFoundResponse({ description: 'Blog not found' })
            @ApiResponse({ status: HttpStatus.OK, description: 'The blog has been successfully liked', type: Media })
            async likes(@Req() request: AuthenticatedRequest, @Param('id') id: string): Promise<Media> {
                return await this.mediaService.likes(request.user.sub, id);
            };

            @Put('dislike/:id')
            @UseGuards(JwtAuthGuard)
            @HttpCode(HttpStatus.OK)
            @ApiOperation({ summary: 'Dislike blog by id' })
            @ApiNotFoundResponse({ description: 'Blog not found' })
            @ApiResponse({ status: HttpStatus.OK, description: 'The blog has been successfully disliked', type: Media })
            async dislikes(@Req() request: AuthenticatedRequest, @Param('id') id: string): Promise<any> {
                return await this.mediaService.dislikes(request.user.sub, id);
            };

            @Put('update/:id')
            @UseGuards(JwtAuthGuard)
            @HttpCode(HttpStatus.OK)
            @ApiOperation({ summary: 'Update blog by id' })
            @ApiNotFoundResponse({ description: 'Blog not found' }) 
            @ApiResponse({ status: HttpStatus.OK, description: 'The blog has been successfully updated', type: Media })
            async update(@Param('id') id: string, @Body() data: UpdateMediaDto): Promise<Media> {
                return await this.mediaService.update(id, data);
            };

            @Delete('delete/:id')
            @UseGuards(JwtAuthGuard)
            @HttpCode(HttpStatus.OK)
            @ApiOperation({ summary: 'Delete blog by id' })
            @ApiNotFoundResponse({ description: 'Blog not found' })
            @ApiResponse({ status: HttpStatus.OK, description: 'The blog has been successfully deleted', type: Media })
            async delete(@Param('id') id: string): Promise<Media> {
                return await this.mediaService.delete(id);
            };
};