import { Controller, UseInterceptors, UseGuards, Req, Res, HttpCode, HttpStatus, Post, Body, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiBody, ApiParam, ApiResponse, ApiTags, ApiQuery } from '@nestjs/swagger';
import { Response } from 'express';

import { RegisterDto } from '@/authentication/dto/register.dto';
import { LoginDto } from '@/authentication/dto/login.dto';

import { AuthService } from '@/authentication/auth.service';
import { User } from '@/models/users/schemas/user.schema';
import { TokenInterceptor } from '@/common/interceptors/token.interceptor';

import { GoogleOauthGuard } from '@/common/guards/google-oauth.guard';
import { GithubOauthGuard } from '@/common/guards/github-oauth.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {

     constructor(private readonly authService: AuthService) {};

     @Get('google')
     @UseGuards(GoogleOauthGuard)
     @ApiOperation({ summary: 'Initiate Google OAuth' })
     async auth() {};

     @Get('google/callback')
     @UseGuards(GoogleOauthGuard)
     @UseInterceptors(TokenInterceptor)
     @ApiOperation({ summary: 'Callback for Google OAuth' })
     @ApiResponse({ status: HttpStatus.OK, description: 'Redirects to the client application with a token cookie' })
     async googleAuthCallback(@Req() req: Request, @Res() response: Response) {
          const user = await this.authService.validateSocialUser((req as any).user, 'google');
          return user;
     };

     @Get('github')
     @UseGuards(GithubOauthGuard)
     @ApiOperation({ summary: 'Initiate Github OAuth' })
     async githubAuth() {};

     @Get('github/callback')
     @UseInterceptors(TokenInterceptor)
     @UseGuards(GithubOauthGuard)
     @ApiOperation({ summary: 'Callback for Github OAuth' })
     @ApiResponse({ status: HttpStatus.OK, description: 'Redirects to the client application with a token cookie' })
     async githubAuthCallback(@Req() req: Request, @Res({ passthrough: true }) response: Response) {
          const user = await this.authService.validateSocialUser((req as any).user.user, 'github');
          return user;
     };
     
     @Get('confirmation_token')
     @HttpCode(HttpStatus.OK)
     @ApiOperation({ summary: 'Confirm an account' })
     @ApiResponse({ status: HttpStatus.OK, description: 'The user has been successfully confirmed.', type: User })
     @ApiQuery({ name: 'token', type: String })
     @Get('confirmation_token')
     async confirmToken(@Query('token') token: string) {
          const user = await this.authService.confrimAccount(token);
          return user;
     };

     @Post('oauth')
     @HttpCode(HttpStatus.OK)
     @UseInterceptors(TokenInterceptor)
     @ApiOperation({ summary: 'OAuth' })
     @ApiResponse({ status: HttpStatus.OK, description: 'Redirects to the client application with a token cookie' })
     @ApiQuery({ name: 'token', type: String })
     async oauth(@Query('token') token: string, @Query('pass') pass: string) {
          return await this.authService.setPassword(token, pass);
     };

     @Post('register')
     @HttpCode(HttpStatus.CREATED)
     @UseInterceptors(TokenInterceptor)
     @ApiOperation({ summary: 'Register a new user' })
     @ApiResponse({ status: HttpStatus.CREATED, description: 'The user has been successfully created.', type: User })
     @ApiBody({ type: RegisterDto })
     async register(@Body() createUserDto: RegisterDto, @Res({ passthrough: true }) response: Response) {
          const result = this.authService.register(createUserDto);
          return result;
     };

     @Post('login')
     @UseInterceptors(TokenInterceptor)
     @HttpCode(HttpStatus.OK)
     @ApiOperation({ summary: 'Login a user' })
     @ApiResponse({ status: HttpStatus.OK, description: 'The user has been successfully logged in.', type: User })
     @ApiBody({ type: LoginDto })
     async login(@Body() loginDto: LoginDto, @Res({ passthrough: true }) response: Response) {
          const result = await this.authService.login(loginDto);
          return result;
     };

     @Post('logout')
     @HttpCode(HttpStatus.OK)
     @ApiOperation({ summary: 'Logout a user' })
     @ApiResponse({ status: HttpStatus.OK, description: 'The user has been successfully logged out.' })
     @ApiBody({ type: LoginDto })
     async logout(@Res({ passthrough: true }) response: Response) {
          response.clearCookie('token');
          response.clearCookie('oauth_token');
          response.clearCookie('current_user');
          
          return { message: 'Successfully logged out' };
     };

     @Post('forgot-password')
     @HttpCode(HttpStatus.OK)
     @ApiOperation({ summary: 'Forgot password' })
     @ApiResponse({ status: HttpStatus.OK, description: 'The user has been successfully logged out.' })
     async forgotPassword(@Query('email') email: string) {
          return this.authService.forgotPassword(email);
     };

     @Post('reset-password')
     @HttpCode(HttpStatus.OK)
     @ApiOperation({ summary: 'Reset password' })
     @ApiResponse({ status: HttpStatus.OK, description: 'The user has been successfully logged out.' })
     async resetPassword(@Query('token') token: string, @Body('password') password: string) {
          return this.authService.resetPassword(token, password);
     };
};