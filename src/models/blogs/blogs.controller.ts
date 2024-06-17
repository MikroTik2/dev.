import { Controller, HttpCode, HttpStatus, Get, Post, UseGuards, Body, Req, Param, Put, Delete, Query, UseInterceptors } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBadRequestResponse, ApiNotFoundResponse } from '@nestjs/swagger';

import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { AuthenticatedRequest } from '@/common/interfaces/authenticated-request.interface';

import { Blog } from '@/models/blogs/schemas/blog.schema';
import { BlogsService } from '@/models/blogs/blogs.service';

import { CreateBlogDto } from '@/models/blogs/dto/create-blog.dto';
import { UpdateBlogDto } from '@/models/blogs/dto/update-blog.dto';

import { ErrorsInterceptor } from '@/common/interceptors/errors.interceptor';

@UseInterceptors(ErrorsInterceptor)
@ApiTags('Blogs')
@Controller('blogs')
export class BlogsController {

            constructor(private readonly blogsService: BlogsService) {};
            
            @Post('new')
            @UseGuards(JwtAuthGuard)
            @HttpCode(HttpStatus.CREATED)
            @ApiOperation({ summary: 'Create a new user' })
            @ApiBadRequestResponse({ description: 'Invalid user data' })
            @ApiResponse({ status: HttpStatus.CREATED, description: 'The user has been successfully created', type: CreateBlogDto })
            async create(@Req() request: AuthenticatedRequest, @Body() data: CreateBlogDto): Promise<Blog> {
                return await this.blogsService.create(request.user.sub, data);
            };

            @Get('all')
            @HttpCode(HttpStatus.OK)
            @ApiOperation({ summary: 'Get all blogs' })
            @ApiResponse({ status: HttpStatus.OK, description: 'Return all blogs', type: [Blog] })
            async find(): Promise<Blog[]> {
                        return await this.blogsService.find();
            };

            @Get('single/:value')
            @HttpCode(HttpStatus.OK)
            @ApiOperation({ summary: 'Get blog by Value' })
            @ApiNotFoundResponse({ description: 'Blog not found' })
            @ApiResponse({ status: HttpStatus.OK, description: 'Return the blog', type: Blog })
            async findOne(@Param('value') value: string, @Query('table') table: string): Promise<Blog> {
                        return await this.blogsService.findOne(table, value);
            };

            @Get('detail/:id')
            @HttpCode(HttpStatus.OK)
            @ApiOperation({ summary: 'Get blog by id' })
            @ApiNotFoundResponse({ description: 'Blog not found' })
            @ApiResponse({ status: HttpStatus.OK, description: 'Return the blog', type: Blog })
            async findById(@Param('id') id: string): Promise<Blog> {
                return await this.blogsService.findById(id);
            };

            @Get('tag/:tag')
            @HttpCode(HttpStatus.OK)
            @ApiOperation({ summary: 'Get blogs by tag' })
            @ApiResponse({ status: HttpStatus.OK, description: 'Return all blogs', type: [Blog] })
            async findBlogsByTag(@Param('tag') tag: string): Promise<Blog[]> {
                        return await this.blogsService.findBlogsByTag(tag);
            };

            @Get('category/:category')
            @HttpCode(HttpStatus.OK)
            @ApiOperation({ summary: 'Get blogs by category' })
            @ApiResponse({ status: HttpStatus.OK, description: 'Return all blogs', type: [Blog] })
            async findBlogsByCategory(@Param('category') category: string): Promise<Blog[]> {
                        return await this.blogsService.findBlogsByCategory(category);
            };

            @Get('search')
            @HttpCode(HttpStatus.OK)
            @ApiOperation({ summary: 'Search blogs' })
            @ApiResponse({ status: HttpStatus.OK, description: 'Return all blogs', type: [Blog] })
            async searchBlogs(@Query('query') query: string): Promise<Blog[]> {
                return await this.blogsService.searchBlogs(query);
            };

            @Put('save/:id')
            @UseGuards(JwtAuthGuard)
            @HttpCode(HttpStatus.OK)
            @ApiOperation({ summary: 'Save blog by id' })
            @ApiNotFoundResponse({ description: 'Blog not found' })
            @ApiResponse({ status: HttpStatus.OK, description: 'The blog has been successfully saved', type: Blog })
            async saving(@Req() request: AuthenticatedRequest, @Param('id') id: string): Promise<any> {
                return await this.blogsService.saving(request.user.sub, id);
            };

            @Put('like/:id')
            @UseGuards(JwtAuthGuard)
            @HttpCode(HttpStatus.OK)
            @ApiOperation({ summary: 'Like blog by id' })
            @ApiNotFoundResponse({ description: 'Blog not found' })
            @ApiResponse({ status: HttpStatus.OK, description: 'The blog has been successfully liked', type: Blog })
            async likes(@Req() request: AuthenticatedRequest, @Param('id') id: string): Promise<Blog> {
                return await this.blogsService.likes(request.user.sub, id);
            };

            @Put('dislike/:id')
            @UseGuards(JwtAuthGuard)
            @HttpCode(HttpStatus.OK)
            @ApiOperation({ summary: 'Dislike blog by id' })
            @ApiNotFoundResponse({ description: 'Blog not found' })
            @ApiResponse({ status: HttpStatus.OK, description: 'The blog has been successfully disliked', type: Blog })
            async dislikes(@Req() request: AuthenticatedRequest, @Param('id') id: string): Promise<any> {
                return await this.blogsService.dislikes(request.user.sub, id);
            };

            @Put('update/:id')
            @UseGuards(JwtAuthGuard)
            @HttpCode(HttpStatus.OK)
            @ApiOperation({ summary: 'Update blog by id' })
            @ApiNotFoundResponse({ description: 'Blog not found' }) 
            @ApiResponse({ status: HttpStatus.OK, description: 'The blog has been successfully updated', type: Blog })
            async update(@Param('id') id: string, @Body() data: UpdateBlogDto): Promise<Blog> {
                return await this.blogsService.update(id, data);
            };

            @Delete('delete/:id')
            @UseGuards(JwtAuthGuard)
            @HttpCode(HttpStatus.OK)
            @ApiOperation({ summary: 'Delete blog by id' })
            @ApiNotFoundResponse({ description: 'Blog not found' })
            @ApiResponse({ status: HttpStatus.OK, description: 'The blog has been successfully deleted', type: Blog })
            async delete(@Param('id') id: string): Promise<Blog> {
                return await this.blogsService.delete(id);
            };
};