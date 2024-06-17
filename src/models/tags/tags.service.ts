import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CloudinaryService } from '@/providers/cloudinary/cloudinary.service';
import { Tag, TagDocument } from "@/models/tags/schemas/tag.schema";

import { CreateTagDto } from '@/models/tags/dto/create-tag.dto';
import { UpdateTagDto } from '@/models/tags/dto/update-tag.dto';
import { User, UserDocument } from '@/models/users/schemas/user.schema';

@Injectable()
export class TagsService {
     constructor(
          @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
          @InjectModel(Tag.name) private readonly tagModel: Model<TagDocument>,
          private readonly cloudinaryService: CloudinaryService,
     ) {};

     async create(data: CreateTagDto): Promise<Tag> {
          let image_obj: object;

          if (data.image) {
               image_obj = await this.cloudinaryService.uploadAvatar(data.image);
          };

          const tag = await this.tagModel.create({
               ...data,
               image: image_obj,
          });

          if (tag) throw new ConflictException(`Tag with this title ${data.title} email already exists`);

          return tag;
     };

     async find(): Promise<Tag[]> {
          const tags = await this.tagModel.find().lean();
          if (!tags) throw new NotFoundException('Tags not found');

          return tags;
     };

     async findOne(table: string, value: string): Promise<Tag> {
          const tag = await this.tagModel.findOne({ [table]: value }).lean();
          if (!tag) throw new NotFoundException(`Tags with value: ${value} not found`);

          return tag;
     };

     async findById(id: string): Promise<Tag> {
          const tag = await this.tagModel.findById(id).lean();
          if (!tag) throw new NotFoundException(`Tag id: ${id} not found`);

          return tag;
     };
     
     async searchTags(query: string): Promise<Tag[]> {
          const tags = await this.tagModel.find({ 
               $or: [
                    { title:       { $regex: query, $options: 'i' } },
                    { description: { $regex: query, $options: 'i' } }
               ]
          }).lean();
      
          if (!tags || tags.length === 0) {
               throw new NotFoundException('Tags not found');
          };
      
          return tags;
     };

     async update(id: string, data: UpdateTagDto): Promise<Tag> {
          const tag = await this.tagModel.findByIdAndUpdate(id, data, { new: true });
          if (!tag) throw new NotFoundException(`Tag id: ${id} not found`);

          return tag;
     };

     async hideTags(id: string, data: string) {
          const user = await this.userModel.findById(id);
          if (!user) throw new NotFoundException(`User id: ${id} not found`);
          
          const tag = await this.tagModel.findById(data);
          if (!tag) throw new NotFoundException(`Tag id: ${data} not found`);
          
          const already_follower = user?.hidden_tags?.find(
               (tag_id) => tag_id.toString() === tag._id.toString()
          );

          if (already_follower) {
               const update = await this.userModel.findByIdAndUpdate(id, {
                    $pull: { hidden_tags: data },
               }, { new: true });

               return update.save();
          } else {
               const update = await this.userModel.findByIdAndUpdate(id, {
                    $push: { hidden_tags: data },
               }, { new: true });

               return update.save();
          };
     };

     async findHideTags(id: string) {
          const user = await this.userModel.findById(id).populate('hidden_tags');
          if (!user) throw new NotFoundException(`User id: ${id} not found`);

          return user.hidden_tags;
     };

     async followTagById(id: string, data: string) {
          const user = await this.userModel.findById(id);
          if (!user) throw new NotFoundException(`User id: ${id} not found`);
          
          const tag = await this.tagModel.findById(data);
          if (!tag) throw new NotFoundException(`Tag id: ${data} not found`);
          
          const already_follower = user?.following_tags?.find(
               (tag_id) => tag_id.toString() === tag._id.toString()
          );

          if (already_follower) {
               const update = await this.userModel.findByIdAndUpdate(id, {
                    $pull: { following_tags: data },
               }, { new: true });

               return update.save();
          } else {
               const update = await this.userModel.findByIdAndUpdate(id, {
                    $push: { following_tags: data },
               }, { new: true });

               return update.save();
          };
     };

     async findFollowTags(id: string): Promise<any>{
          const user = await this.userModel.findById(id).populate('following_tags');
          if (!user) throw new NotFoundException(`User id: ${id} not found`);

          return user.following_tags;
     };

     async delete(id: string) {
          const tag = await this.tagModel.findByIdAndDelete(id);
          if (!tag) throw new NotFoundException(`Tag id: ${id} not found`);

          await this.cloudinaryService.deleteBlogImage(tag.image.public_id);
          return tag;
     };
};