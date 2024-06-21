import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CloudinaryService } from '@/providers/cloudinary/cloudinary.service';
import { User, UserDocument } from '@/models/users/schemas/user.schema';
import { MailsService } from '@/providers/mails/mails.service';

import { CreateUserDto } from '@/models/users/dto/create-user.dto';
import { UpdateUserDto } from '@/models/users/dto/update-user.dto';
import { UpdatePasswordDto } from '@/models/users/dto/update-password.dto';
import { CacheService } from '@/providers/cache/redis/cache.service';

import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

@Injectable()
export class UsersService {
     constructor(
          @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
          private readonly cloudinaryService: CloudinaryService,
          private readonly mailsService: MailsService,
          private readonly cacheService: CacheService,
     ) {};

     private users_id;
     private users_value;
     private users_username;
     private users_email;

     public generateToken(): string {
          const generateToken = crypto.randomBytes(32).toString('hex');
          return crypto.createHash('sha256').update(generateToken).digest('hex');
     };

     async create(data: CreateUserDto): Promise<User> {
          const user = await this.userModel.create(data);
          await this.cacheService.del('users');
          await this.cacheService.del(this.users_id);
          await this.cacheService.del(this.users_value);
          return user;
     };

     async find(): Promise<User[]> {
          const cached = await this.cacheService.get('users');
          if (cached) return cached;

          const users = await this.userModel.find().lean();
          if (!users) throw new NotFoundException('Users not found');

          await this.cacheService.set('users', users);

          return users;
     };

     async findOne(table: string, value: string): Promise<User> {

          this.users_id = `user_${value}`
          const cachedData = await this.cacheService.get(this.users_id);
          if (cachedData) return cachedData;

          const user = await this.userModel.findOne({ [table]: value }).lean();
          if (!user) throw new NotFoundException(`User with value: ${value} not found`);

          await this.cacheService.set(this.users_value.toString(), user);  

          return user;
     };

     async findById(id: string): Promise<User> {
          this.users_id = `user_${id}`
          const cachedData = await this.cacheService.get(this.users_id);
          if (cachedData) return cachedData;

          const user = await this.userModel.findById(id).lean();
          if (!user) throw new NotFoundException(`User with id: ${id} count not found`);

          await this.cacheService.set(this.users_id, user);  

          return user;
     };

     async findByEmail(email: string): Promise<User> {
          this.users_email = `user_${email}`
          const cachedData = await this.cacheService.get(this.users_email);
          if (cachedData) return cachedData;

          const user = await this.userModel.findOne({ email: email }).lean();
          await this.cacheService.set(this.users_email, user);  

          return user;
     };

     async findByUsername(username: string): Promise<User> {
          this.users_username = `user_${username}`
          const cachedData = await this.cacheService.get(this.users_username);
          if (cachedData) return cachedData;
          
          const user = await this.userModel.findOne({ username: username }).lean();
          if (!user) throw new NotFoundException(`User with username: ${username}`);
          await this.cacheService.set(this.users_username, user);  

          return user;
     };

     async blockUser(id: string): Promise<User> {
          const user = await this.userModel.findByIdAndUpdate(id, {
               isBlocked: true,
          }, { new: true });

          if (!user) throw new NotFoundException(`User id: ${id} not found`);
          await this.cacheService.reset();

          return user;
     };

     async unBlockUser(id: string): Promise<User> {
          const user = await this.userModel.findByIdAndUpdate(id, {
               isBlocked: false,
          }, { new: true });

          if (!user) throw new NotFoundException(`User id: ${id} not found`);
          await this.cacheService.reset();

          return user;
     };

     async updatePassword(id: string, updatePasswordDto: UpdatePasswordDto): Promise<User> {
          const user = await this.userModel.findById(id);
          if (!user) throw new NotFoundException(`User id: ${id} not found`);

          const check = await bcrypt.compare(updatePasswordDto.oldPassword, user.password);

          if (!check) throw new BadRequestException(`Old password is incorrect`);
          if (updatePasswordDto.password !== updatePasswordDto.confirmPassword) throw new BadRequestException(`Passwords do not match`);

          const update = await this.userModel.findByIdAndUpdate(id, {
               password: await bcrypt.hash(updatePasswordDto.password, 10),
          }, { new: true });

          if (!update) throw new BadRequestException(`User id: ${id} not updated`);
          await this.cacheService.reset();

          return update;
     };

     async updateRole(id: string, role: string): Promise<User> {
          const user = await this.userModel.findByIdAndUpdate(id, {
               role: role,
          }, { new: true });
     
          if (!user) throw new NotFoundException(`User id: ${id} not found`);
          await this.cacheService.reset();

          return user;
     };

     async updateUser(id: string, data: UpdateUserDto): Promise<User> {
          const user = await this.findById(id);
          if (!user) throw new NotFoundException(`User id: ${id} not found`);

          let avatar_url;

          if (data.avatar) {
               avatar_url = await this.cloudinaryService.updateAvatar(user?.avatar?.public_id, data?.avatar?.url);
          };

          const userUpdated = await this.userModel.findByIdAndUpdate(id, {
               ...data,
               avatar: avatar_url,
          }, { new: true });

          if (!userUpdated) throw new BadRequestException(`User id: ${id} not updated`);
          await this.cacheService.reset();

          return userUpdated;
     };

     async deleteUser(id: string): Promise<void> {
          const user = await this.userModel.findById(id);

          if (!user) throw new NotFoundException(`User id: ${id} not found`);

          user.destroy_token = this.generateToken();

          await this.mailsService.onSendDestroyAccount(user.username, user.email, user.destroy_token);
          await this.cacheService.reset();
          
          await user.save();
     };

     async deleteConfirm(token: string, username: string): Promise<User> {
          const user = await this.userModel.findOne({ destroy_token: token });
          if (!user) throw new NotFoundException(`User token not found`);

          const user_name = this.userModel.findOne({ username: username });
          if (!user_name) throw new NotFoundException(`User name not found`);
          
          await this.cloudinaryService.deleteAvatar(user?.avatar?.public_id);
          await this.cacheService.reset();

          const userDelete = await this.userModel.findByIdAndDelete(user._id);
          return userDelete;
     };
};