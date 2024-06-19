import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Media, MediaDocument } from '@/models/media/schemas/media.schema';
import { User, UserDocument } from '@/models/users/schemas/user.schema';
import { Tag, TagDocument } from "@/models/tags/schemas/tag.schema";

import { CreateMediaDto } from '@/models/media/dto/create-media.dto';
import { UpdateMediaDto } from '@/models/media/dto/update-media.dto';

import { CloudinaryService } from '@/providers/cloudinary/cloudinary.service';
import { IPagination } from "@/common/interfaces/pagination.interface";

@Injectable()
export class MediaService {
            
            constructor(
                        @InjectModel(Media.name) private readonly mediaModel: Model<MediaDocument>,
                        @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
                        @InjectModel(Tag.name) private readonly tagModel: Model<TagDocument>,
                        private readonly cloudinaryService: CloudinaryService,
            ) {};

            async create(id: string, data: CreateMediaDto): Promise<Media> {

                        const media = await this.mediaModel.create({ 
                                    ...data, 
                                    author: id,
                                    video: await this.cloudinaryService.uploadVideo(data.video),
                        });

                        
                        for (const tag of data.tags) {
                            const find = await this.tagModel.findOne({ title: tag });

                            if (find) {
                                await this.tagModel.findOneAndUpdate({ title: tag }, {
                                    $inc: { posts: 1 },
                                }, { new: true })
                                console.log('not create')
                            } else {
                                await this.tagModel.create({ title: tag });
                            };
                        };

                        return media;
            };

            async find(pagination: IPagination): Promise<Media[]> {
                        const { skip, limit, sort } = pagination;
        
                        let query = this.mediaModel.find().lean().skip(skip).limit(limit);
                
                        if (sort && sort.length > 0) {
                                    sort.forEach((s) => {
                                                const sort = s.by === 'ASC' ? 1 : -1;
                                                query = query.sort({ [s.field]: sort });
                                    });
                        };
                    
                        return query.exec();
            };

            async findOne(table: string, value: string): Promise<Media> {
                        const blog = await this.mediaModel.findOne({ [table]: value }).lean();
                        if (!blog) throw new NotFoundException(`User with value: ${value} not found`);
              
                        return blog;     
            };

            async findById(id: string): Promise<Media> {
                        const blog = await this.mediaModel.findById(id).lean();
                        if (!blog) throw new NotFoundException(`Blog id: ${id} not found`);

                        return blog;
            };

            async findBlogsByTag(tag: string): Promise<Media[]> {
                        const blog = await this.mediaModel.find({ tags
                                    : tag }).lean();
                        if (!blog) throw new NotFoundException(`Blog tag: ${tag} not found`);

                        return blog;
            };

            async findBlogsByCategory(category: string): Promise<Media[]> {
                        const blog = await this.mediaModel.find({ categories: category }).lean();
                        if (!blog) throw new NotFoundException(`Blog category: ${category} not found`);

                        return blog;
            };

            async searchBlogs(query: string): Promise<Media[]> {
                        const blogs = await this.mediaModel.find({
                                    $or: [
                                                { title:      { $regex: query, $options: 'i' } },
                                                { slug:       { $regex: query, $options: 'i' } },
                                                { categories: { $regex: query, $options: 'i' } },
                                                { content:    { $regex: query, $options: 'i' } },
                                    ],
                        });

                        if (!blogs || blogs.length === 0) {
                                    throw new NotFoundException('Media not found');
                        };

                        return blogs;
            };

            async likes(user_id: string, blog_id: string): Promise<Media> {
                        const blog = await this.mediaModel.findById(blog_id);
                        if (!blog) throw new NotFoundException(`Blog id: ${blog_id} not found`);
                    
                        const alreadyLiked = blog.likes?.find(
                                    (uid) => uid.toString() === user_id.toString()
                        );
                    
                        let updateOperations: object = {};
                        
                        if (alreadyLiked) {
                                    updateOperations = {
                                                $pull: { likes: user_id }
                                    };
                        } else {
                                    updateOperations = {
                                                $push: { likes: user_id },
                                                $pull: { dislikes: user_id },
                                    };
                        }
                    
                        const updatedBlog = await this.mediaModel.findByIdAndUpdate(blog_id, updateOperations, { new: true });
                        return updatedBlog;
            }; 

            async dislikes(user_id: string, blog_id: string): Promise<Media> {
                        const blog = await this.mediaModel.findById(blog_id);
                        if (!blog) throw new NotFoundException(`Blog id: ${blog_id} not found`);
                    
                        const alreadyDisliked = blog.dislikes?.find(
                            (uid) => uid.toString() === user_id.toString()
                        );
                    
                        let updateOperations: object = {};
                        
                        if (alreadyDisliked) {
                                    updateOperations = {
                                                $pull: { dislikes: user_id }
                                    };
                        } else {
                                    updateOperations = {
                                                $push: { dislikes: user_id },
                                                $pull: { likes: user_id },
                                    };
                        };
                    
                        const updatedBlog = await this.mediaModel.findByIdAndUpdate(blog_id, updateOperations, { new: true });
                        return updatedBlog;
            };
 
            async saving(user_id: string, blog_id: string): Promise<User> {
                        const user = await this.userModel.findById(user_id);
                        if (!user) throw new NotFoundException(`User id: ${user_id} not found`);

                        const alreadyDisliked = user?.save_blogs?.find(
                                    (uid) => uid === blog_id.toString()
                        );
                        
                        let updateOperations: object = {};
                        
                        if (alreadyDisliked) {
                                    updateOperations = {
                                                $pull: { save_blogs: blog_id }
                                    };
                        } else {
                                    updateOperations = {
                                                $push: { save_blogs: blog_id },
                                    };
                        };
                        
                        const updatedBlog = await this.userModel.findByIdAndUpdate(user._id, updateOperations, {  new: true});
                        return updatedBlog;
            };

            async update(id: string, data: UpdateMediaDto): Promise<Media> {
                        const blog = await this.mediaModel.findByIdAndUpdate(id, { 
                                    ...data, 
                        }, { new: true }).lean();

                        await this.cloudinaryService.updateVideo(blog.video.public_id, blog.video.secure_url);

                        if (!blog) throw new NotFoundException(`Blog id: ${id} not found`);

                        return blog;
            };

            async delete(id: string): Promise<Media> {
                        const blog = await this.mediaModel.findByIdAndDelete(id).lean();
                        if (!blog) throw new NotFoundException(`Blog id: ${id} not found`);

                        this.cloudinaryService.deleteVideo(blog.video.public_id);

                        return blog;
            };
};