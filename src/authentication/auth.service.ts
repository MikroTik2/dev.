import { Injectable, ConflictException, UnauthorizedException, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { JwtService } from "@nestjs/jwt";
import { Model } from "mongoose";

import { UsersService } from "@/models/users/users.service";
import { MailsService } from "@/providers/mails/mails.service";
import { User, UserDocument, UserSchema } from "@/models/users/schemas/user.schema";

import { RegisterDto } from "@/authentication/dto/register.dto";
import { LoginDto } from "@/authentication/dto/login.dto";

import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
 
@Injectable()
export class AuthService {
     constructor(
          @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
          private readonly jwtService: JwtService,
          private readonly usersService: UsersService,
          private readonly mailsService: MailsService,
     ) {};

     public generateToken(user: any): string {
          const payload = { email: user.email, sub: user._id };
          return this.jwtService.sign(payload);
     };

     public async setPassword(token: string, password: string): Promise<{user: any, token: string}> {
          const user = await this.userModel.findOne({ confirm_token: token });
          if (!user) throw new UnauthorizedException('Invalid token');

          user.password = await bcrypt.hash(password, 10);
          
          const userToken = this.generateToken(user)

          await user.save();
          return { user: user, token: userToken };
     };

     public async validateUser(email: string, password: string) {
          const user = await this.usersService.findByEmail(email);

          const isPasswordValid = await bcrypt.compare(password, user.password);
          if (!isPasswordValid) throw new UnauthorizedException('Invalid password');
          return user;
     };

     public async validateSocialUser(data: any, socId: string): Promise<{ user: any, token: string }> {
          const { google_id, github_id, email } = data;
          const generate_token = crypto.randomBytes(32).toString("hex");
          const confirm_token = crypto
               .createHash("sha256")
               .update(generate_token)
               .digest("hex");

          const findUser = await this.userModel
               .findOne({
                    $or: [
                         { [socId]: google_id || github_id },
                         { email },
                    ],
               });
       
          if (!findUser) {

               UserSchema.path('password').required(false);

               const user = await this.userModel.create({
                    ...data,
                    confirm_token: confirm_token,
               });

               await this.mailsService.onSendVerification(data.username, data.email, confirm_token);

               const token = this.generateToken(user);
       
               return {
                    user,
                    token,
               };
          };
     
          if (findUser.provider === 'google') {
               const user = await this.userModel.findByIdAndUpdate(findUser._id, {
                    provider: data.provider,
                    google_id: data.google_id,
                    avatar: findUser.avatar && findUser.avatar.url ? findUser.avatar : {
                         public_id: data.avatar.public_id,
                         url: data.avatar.url,
                     },
               }, { new: true });

               const token = this.generateToken(user);
       
               return {
                    user,
                    token,
               };
          };

          if (findUser.provider || data.provider === 'github') {
               const user = await this.userModel.findByIdAndUpdate(findUser._id, {
                    provider: data.provider,
                    github_id: data.github_id,
                    avatar: findUser.avatar && findUser.avatar.url ? findUser.avatar : {
                         public_id: data.avatar.public_id,
                         url: data.avatar.url,
                    },
               }, { new: true });

               const token = this.generateToken(user);

               return {
                    user,
                    token,
               };
          };
     };

     async register(data: RegisterDto): Promise<{ user: User, token: string }> {
          const existingUser = await this.usersService.findByEmail(data.email);
          if (existingUser) throw new ConflictException(`User with this ${data.email} email already exists`);

          const generate_token = crypto.randomBytes(32).toString("hex");
          const confirm_token = crypto
               .createHash("sha256")
               .update(generate_token)
               .digest("hex");

          const user = await this.usersService.create({
               ...data, 
               confirm_token: confirm_token,
               password: await bcrypt.hash(data.password, 10),
          });

          await this.mailsService.onSendVerification(data.username, data.email, confirm_token)

          const token = this.generateToken(user);

          return { user, token };

     };

     async login(data: LoginDto): Promise<{ user: User, token: string }> {
          const { email, password } = data;

          const user = await this.validateUser(email, password);
          if (!user) throw new UnauthorizedException('Invalid credentials');

          const token = this.generateToken(user);

          return {
               user,
               token,
          };
     };

     async confrimAccount(token: string): Promise<User> {
          const user = await this.userModel.findOne({ confirm_token: token  });
          if (!user) throw new NotFoundException(`User with tokem: ${token} not found`);

          const user_update = await this.userModel.findByIdAndUpdate(user._id, {
               confirm_account: true,
               confirm_token: null,
          }, { new: true });

          return user_update;
     };

     async forgotPassword(email: string): Promise<{ message: string }> {
          const user = await this.userModel.findOne({ email: email });
          if (!user) throw new NotFoundException(`User with email ${email} not found`);

          const generate_token = crypto.randomBytes(32).toString("hex");
          const reset_token = crypto
               .createHash("sha256")
               .update(generate_token)
               .digest("hex");

          user.reset_password_token = reset_token;
          user.reset_password_expire = new Date(Date.now() + 15 * 60 * 1000);

          this.mailsService.onSendForgotPassword(user.email, user.reset_password_token);

          await user.save();
          return { message: 'Checking your email and updated password' };
     };

     async resetPassword(token: string, password: string): Promise<{ message: string }> {
          const user = await this.userModel.findOne({ reset_password_token: token });

          user.password = await bcrypt.hash(password, 10);
          user.reset_password_token = undefined;
          user.reset_password_expire = undefined;

          await user.save();
          return { message: 'Password successfully updated.' };
     };
};