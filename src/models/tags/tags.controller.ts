import { Controller, HttpCode, HttpStatus, Get, Post, UseGuards, Body, Req, Param, Put, Delete, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBadRequestResponse, ApiNotFoundResponse } from '@nestjs/swagger';

import { CreateTagDto } from '@/models/tags/dto/create-tag.dto';
import { UpdateTagDto } from '@/models/tags/dto/update-tag.dto';

import { Tag } from '@/models/tags/schemas/tag.schema';
import { TagsService } from '@/models/tags/tags.service';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { AuthenticatedRequest } from '@/common/interfaces/authenticated-request.interface';


@ApiTags('Tags')
@Controller('tags')
export class TagsController {
     constructor(private readonly tagsService: TagsService) {};

     @Post('new')
     @HttpCode(HttpStatus.CREATED)
     @ApiResponse({ status: HttpStatus.CREATED, description: 'The tag has been successfully created', type: CreateTagDto })
     @ApiOperation({ summary: 'Create a new tag' })
     @ApiBadRequestResponse({ description: 'Invalid tag data' })
     async create(@Body() tag: CreateTagDto): Promise<CreateTagDto> {
          return await this.tagsService.create(tag);
     };

     @Get('all')
     @HttpCode(HttpStatus.OK)
     @ApiOperation({ summary: 'Get all tags' })
     @ApiResponse({ status: HttpStatus.OK, description: 'Return all tags', type: [Tag] })
     async find(): Promise<Tag[]> {
          return await this.tagsService.find();
     };

     @Get('single/:value')
     @HttpCode(HttpStatus.OK)
     @ApiOperation({ summary: 'Find tag by Value' })
     @ApiResponse({ status: HttpStatus.OK, description: 'Return the tag', type: Tag })
     async findOne(@Param('value') value: string, @Query('table') table: string): Promise<Tag> {
          return await this.tagsService.findOne(table, value);
     };

     @Get('detail/:id')
     @HttpCode(HttpStatus.OK)
     @ApiOperation({ summary: 'Find tag by ID' })
     @ApiResponse({ status: HttpStatus.OK, description: 'Return the tag', type: Tag })
     async findById(@Param('id') id: string): Promise<Tag> {
          return await this.tagsService.findById(id);
     };

     @Get('search')
     @HttpCode(HttpStatus.OK)
     @ApiOperation({ summary: 'Search tags' })
     @ApiResponse({ status: HttpStatus.OK, description: 'Return all tags', type: [Tag] })
     async searchTags(@Query('query') query: string): Promise<Tag[]> {
          return await this.tagsService.searchTags(query);
     };

     @Get('follow/all')
     @UseGuards(JwtAuthGuard)
     @HttpCode(HttpStatus.OK)
     @ApiOperation({ summary: 'Get all followed tags' })
     @ApiResponse({ status: HttpStatus.OK, description: 'Return all followed tags', type: [Tag] })
     async findFollowTags(@Req() request: AuthenticatedRequest): Promise<any> {
          return await this.tagsService.findFollowTags(request.user.sub);
     };

     @Get('hide/all')
     @UseGuards(JwtAuthGuard)
     @HttpCode(HttpStatus.OK)
     @ApiOperation({ summary: 'Get all hide tags' })
     @ApiResponse({ status: HttpStatus.OK, description: 'Return all hide tags', type: [Tag] })
     async findHideTags(@Req() request: AuthenticatedRequest): Promise<any> {
          return await this.tagsService.findHideTags(request.user.sub);
     };
     
     @Put('edit-tag/:id')
     @HttpCode(HttpStatus.OK)
     @ApiResponse({ status: HttpStatus.OK, description: 'The tag has been successfully updated', type: UpdateTagDto })
     @ApiOperation({ summary: 'Update a tag' })
     @ApiBadRequestResponse({ description: 'Invalid tag data' })
     async update(@Param('id') id: string, @Body() tag: UpdateTagDto): Promise<UpdateTagDto> {
          return await this.tagsService.update(id, tag);
     };

     @Put('follow')
     @UseGuards(JwtAuthGuard)
     @HttpCode(HttpStatus.OK)
     @ApiOperation({ summary: 'Follow a tag' })
     @ApiBadRequestResponse({ description: 'Invalid tag data' })
     @ApiResponse({ status: HttpStatus.OK, description: 'The tag has been successfully followed', type: UpdateTagDto })
     async followTag(@Req() request: AuthenticatedRequest, @Query('tag_id') tag_id: string): Promise<any> {
          return await this.tagsService.followTagById(request.user.sub, tag_id);
     };
     
     @Put('hide')
     @UseGuards(JwtAuthGuard)
     @HttpCode(HttpStatus.OK)
     @ApiOperation({ summary: 'Hide a tag' })
     @ApiBadRequestResponse({ description: 'Invalid tag data' })
     @ApiResponse({ status: HttpStatus.OK, description: 'The tag has been successfully hide', type: UpdateTagDto })
     async hideTag(@Req() request: AuthenticatedRequest, @Query('tag_id') tag_id: string): Promise<any> {
          return await this.tagsService.hideTags(request.user.sub, tag_id);
     };

     @Delete('delete/:id') 
     @HttpCode(HttpStatus.OK)
     @ApiOperation({ summary: 'Delete a tag' })
     @ApiNotFoundResponse({ description: 'Tag not found' })
     @ApiResponse({ status: HttpStatus.OK, description: 'The tag has been successfully deleted', type: Tag })
     async delete(@Param('id') id: string): Promise<Tag> {
          return await this.tagsService.delete(id);
     };
};