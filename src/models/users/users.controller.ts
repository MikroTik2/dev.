import { Controller, Res, HttpCode, HttpStatus, Get, Post, UseGuards, Body, Req, Param, Put, Delete, Query, UseInterceptors } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBadRequestResponse, ApiNotFoundResponse } from '@nestjs/swagger';
import { Response } from 'express';

import { CreateUserDto } from '@/models/users/dto/create-user.dto';
import { UpdateUserDto } from '@/models/users/dto/update-user.dto';
import { UpdatePasswordDto } from '@/models/users/dto/update-password.dto';

import { Roles } from '@/common/decorators/roles.decorator';
import { RolesGuard } from '@/common/guards/roles.guard';

import { User } from '@/models/users/schemas/user.schema';
import { UsersService } from '@/models/users/users.service';

import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { AuthenticatedRequest } from '@/common/interfaces/authenticated-request.interface';

import { ErrorsInterceptor } from '@/common/interceptors/errors.interceptor';

@UseInterceptors(ErrorsInterceptor)
@ApiTags('Users')
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {};

    @Post('new')
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'Create a new user' })
    @ApiBadRequestResponse({ description: 'Invalid user data' })
    @ApiResponse({ status: HttpStatus.CREATED, description: 'The user has been successfully created', type: CreateUserDto })
    async create(@Body() user: CreateUserDto): Promise<CreateUserDto> {
        return await this.usersService.create(user);
    };

    @Get('all')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Get all users' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Return all users', type: [User] })
    async find(): Promise<User[]> {
        return await this.usersService.find();
    };
    
    @Get('single/:value')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Find user by Value' })
    @ApiNotFoundResponse({ description: 'User not found' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Return the user', type: User })
    async findOne(@Param('value') value: string, @Query('table') table: string): Promise<User> {
        return await this.usersService.findOne(table, value);
    };

    @Get('detail/:id')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Find user by ID' })
    @ApiNotFoundResponse({ description: 'User not found' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Return the user', type: User })
    async findById(@Param('id') id: string): Promise<User> {
        return await this.usersService.findById(id);
    };

    @Get('email/:email')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Find user by email' })
    @ApiNotFoundResponse({ description: 'User not found' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Return the user', type: User })
    async findByEmail(@Param('email') email: string): Promise<User> {
        return await this.usersService.findByEmail(email);
    };

    @Get('username/:username')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Find user by username' })
    @ApiNotFoundResponse({ description: 'User not found' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Return the user', type: User })
    async findByUsername(@Param('username') username: string): Promise<User> {
        return await this.usersService.findByUsername(username);
    };

    @Get('profile')
    @HttpCode(HttpStatus.OK)
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Retrieve user profile' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Successfully retrieved user profile.', type: User })
    async getProfile(@Req() request: AuthenticatedRequest): Promise<any> {
        return await this.usersService.findById(request.user.sub);
    };

    @Put('block/:id')
    @Roles('admin')
    @HttpCode(HttpStatus.OK)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @ApiOperation({ summary: 'Block a user' })
    @ApiNotFoundResponse({ description: 'User not found' })
    @ApiResponse({ status: HttpStatus.OK, description: 'The user has been successfully blocked', type: User })
    async block(@Param('id') id: string): Promise<User> {
        return await this.usersService.blockUser(id);
    };

    @Put('unblock/:id')
    @Roles('admin')
    @HttpCode(HttpStatus.OK)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @ApiOperation({ summary: 'Unblock a user' })
    @ApiResponse({ status: HttpStatus.OK, description: 'The user has been successfully unblocked', type: User })
    @ApiNotFoundResponse({ description: 'User not found' })
    async un_block(@Param('id') id: string): Promise<User> {
        return await this.usersService.unBlockUser(id);
    };

    @Put('edit-role/:id')
    @Roles('admin')
    @HttpCode(HttpStatus.OK)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @ApiOperation({ summary: 'Update user role' })
    @ApiNotFoundResponse({ description: 'User not found' })
    @ApiBadRequestResponse({ description: 'Invalid role' })
    @ApiResponse({ status: HttpStatus.OK, description: 'The user role has been successfully updated', type: User })
    async update_role(@Param('id') id: string, @Query('role') role: string): Promise<User> {
        return await this.usersService.updateRole(id, role);
    };
    
    @Put('edit-password')
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Update user password' })
    @ApiNotFoundResponse({ description: 'User not found' })
    @ApiBadRequestResponse({ description: 'Invalid password' })
    @ApiResponse({ status: HttpStatus.OK, description: 'The password role has been successfully updated', type: User })
    async updatePassword(@Body() updatePasswordDto: UpdatePasswordDto, @Req() request: AuthenticatedRequest): Promise<void> {
        await this.usersService.updatePassword(request.user.sub, updatePasswordDto);
    };

    @Put('edit-user')
    @HttpCode(HttpStatus.OK)
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Update user data' })
    @ApiNotFoundResponse({ description: 'User not found' })
    @ApiBadRequestResponse({ description: 'Invalid request' })
    @ApiResponse({ status: HttpStatus.OK, description: 'The user data has been successfully updated', type: User })
    async update(@Req() request: AuthenticatedRequest, @Body() data: UpdateUserDto): Promise<UpdateUserDto> {
        return await this.usersService.updateUser(request.user.sub, data);
    };

    @Delete('delete')
    @HttpCode(HttpStatus.OK)
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Delete a user' })
    @ApiNotFoundResponse({ description: 'User not found' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Checking your email', type: User })
    async delete(@Req() request: AuthenticatedRequest): Promise<{ message: string }> {
        await this.usersService.deleteUser(request.user.sub);
        return { message: 'You have requested account deletion. Please, check your email for further instructions.' };
    };

    @Delete('confirm_destroy')
    @HttpCode(HttpStatus.OK)
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Delete confirm a user' })
    @ApiNotFoundResponse({ description: 'User not found' })
    @ApiResponse({ status: HttpStatus.OK, description: 'The user has been successfully deleted', type: User })
    async deleteConfirm(@Res({ passthrough: true }) res: Response, @Query('token') token: string, @Query('username') username: string): Promise<User> {
        const user = await this.usersService.deleteConfirm(token, username);
        res.clearCookie('token');

        return user;
    };
};