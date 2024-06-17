import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CloudinaryService } from '@/providers/cloudinary/cloudinary.service';
import { User, UserDocument } from '@/models/users/schemas/user.schema';
import { MailsService } from '@/providers/mails/mails.service';

import { CreateUserDto } from '@/models/users/dto/create-user.dto';
import { UpdateUserDto } from '@/models/users/dto/update-user.dto';
import { UpdatePasswordDto } from '@/models/users/dto/update-password.dto';

import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

@Injectable()
export class UsersService {
     constructor(
          @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
          private readonly cloudinaryService: CloudinaryService,
          private readonly mailsService: MailsService,
     ) {};

     public generateToken(): string {
          const generateToken = crypto.randomBytes(32).toString('hex');
          return crypto.createHash('sha256').update(generateToken).digest('hex');
     };

     async create(data: CreateUserDto): Promise<User> {
          const user = await this.userModel.create(data);
          return user;
     };

     async find(): Promise<User[]> {
          const users = await this.userModel.find().lean();
          if (!users) throw new NotFoundException('Users not found');

          return users;
     };

     async findOne(table: string, value: string): Promise<User> {
          const user = await this.userModel.findOne({ [table]: value }).lean();
          if (!user) throw new NotFoundException(`User with value: ${value} not found`);

          return user;
     };

     async findById(id: string): Promise<User> {
          const user = await this.userModel.findById(id).lean();
          if (!user) throw new NotFoundException(`User with id: ${id} count not found`);

          return user;
     };

     async findByEmail(email: string): Promise<User> {
          const user = await this.userModel.findOne({ email: email }).lean();
          return user;
     };

     async findByUsername(username: string): Promise<User> {
          const user = await this.userModel.findOne({ username: username }).lean();
          if (!user) throw new NotFoundException(`User with username: ${username}`);

          return user;
     };

     async blockUser(id: string): Promise<User> {
          const user = await this.userModel.findByIdAndUpdate(id, {
               isBlocked: true,
          }, { new: true });

          if (!user) throw new NotFoundException(`User id: ${id} not found`);
          return user;
     };

     async unBlockUser(id: string): Promise<User> {
          const user = await this.userModel.findByIdAndUpdate(id, {
               isBlocked: false,
          }, { new: true });

          if (!user) throw new NotFoundException(`User id: ${id} not found`);
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

          return update;
     };

     async updateRole(id: string, role: string): Promise<User> {
          const user = await this.userModel.findByIdAndUpdate(id, {
               role: role,
          }, { new: true });
     
          if (!user) throw new NotFoundException(`User id: ${id} not found`);
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
          return userUpdated;
     };

     async deleteUser(id: string): Promise<void> {
          const user = await this.userModel.findById(id);

          if (!user) throw new NotFoundException(`User id: ${id} not found`);

          user.destroy_token = this.generateToken();

          await this.mailsService.onSendDestroyAccount(user.username, user.email, user.destroy_token);
          
          await user.save();
     };

     async deleteConfirm(token: string, username: string): Promise<User> {
          const user = await this.userModel.findOne({ destroy_token: token });
          if (!user) throw new NotFoundException(`User token not found`);

          const user_name = this.userModel.findOne({ username: username });
          if (!user_name) throw new NotFoundException(`User name not found`);
          
          await this.cloudinaryService.deleteAvatar(user?.avatar?.public_id);

          const userDelete = await this.userModel.findByIdAndDelete(user._id);
          return userDelete;
     };
};