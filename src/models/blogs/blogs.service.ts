import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from 'mongoose';

import { Blog, BlogDocument } from "@/models/blogs/schemas/blog.schema";
import { User, UserDocument } from '@/models/users/schemas/user.schema';
import { Tag, TagDocument } from "@/models/tags/schemas/tag.schema";

import { CreateBlogDto } from "@/models/blogs/dto/create-blog.dto";
import { UpdateBlogDto } from "@/models/blogs/dto/update-blog.dto";

import { CloudinaryService } from "@/providers/cloudinary/cloudinary.service";
import { IPagination } from "@/common/interfaces/pagination.interface";
import { CacheService } from '@/providers/cache/redis/cache.service';

@Injectable()
export class BlogsService {
            
            constructor(
                        @InjectModel(Blog.name) private readonly blogModel: Model<BlogDocument>,
                        @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
                        @InjectModel(Tag.name) private readonly tagModel: Model<TagDocument>,
                        private readonly cloudinaryService: CloudinaryService,
                        private readonly cacheService: CacheService,
            ) {};

            private blogs;
            private blogs_search;

            async create(id: string, data: CreateBlogDto): Promise<Blog> {

                        const blog = await this.blogModel.create({ 
                                    ...data,
                                    images: await this.cloudinaryService.uploadBlogImage(data?.images),
                                    author: id,
                        });

                        for (const tag of data.tags) {
                            const find = await this.tagModel.findOne({ title: tag });

                            if (find) {
                                await this.tagModel.findOneAndUpdate({ title: tag }, {
                                    $inc: { posts: 1 },
                                }, { new: true })
                            } else {
                                await this.tagModel.create({ title: tag });
                            };
                        };

                        await this.cacheService.del(this.blogs);
                        await this.cacheService.del(this.blogs_search);

                        return blog;
            };

            async find(pagination: IPagination): Promise<any> {
                const { skip, limit, sort } = pagination;

                let query = this.blogModel.find().lean().skip(skip).limit(limit);
        
                if (sort && sort.length > 0) {
                    sort.forEach((s) => {
                        const sort = s.by === 'ASC' ? 1 : -1;
                        query = query.sort({ [s.field]: sort });
                    });
                }
                
                this.blogs = `blogs_${JSON.stringify(pagination)}`;
                const cachedResult = await this.cacheService.get(this.blogs);

                if (cachedResult) {
                    return cachedResult;
                } else {
                    const result = await query.exec();
                    await this.cacheService.set(this.blogs, result);
                    return result;
                };
            };

            async findOne(table: string, value: string): Promise<Blog> {
                const cachedData = await this.cacheService.get(value.toString());
                if (cachedData) return cachedData;

                const blog = await this.blogModel.findOne({ [table]: value }).lean();
                if (!blog) throw new NotFoundException(`Blog with value: ${value} not found`);
        
                await this.cacheService.set(value.toString(), blog);  

                return blog;     
            };

            async findById(id: string): Promise<Blog> {
                const cachedData = await this.cacheService.get(id.toString());
                if (cachedData) return cachedData;

                const blog = await this.blogModel.findById(id).lean();
                if (!blog) throw new NotFoundException(`Blog id: ${id} not found`);
                
                await this.cacheService.set(id.toString(), blog);  

                return blog;
            };

            async findBlogsByTag(tag: string): Promise<Blog[]> {
                const cachedData = await this.cacheService.get(tag.toString());
                if (cachedData) return cachedData;

                const blog = await this.blogModel.find({ tags: tag }).lean();
                if (!blog) throw new NotFoundException(`Blog tag: ${tag} not found`);

                await this.cacheService.set(tag.toString(), blog);

                return blog;
            };

            async findBlogsByCategory(category: string): Promise<Blog[]> {
                const cachedData = await this.cacheService.get(category.toString());
                if (cachedData) return cachedData;

                const blog = await this.blogModel.find({ categories: category }).lean();
                if (!blog) throw new NotFoundException(`Blog category: ${category} not found`);

                await this.cacheService.set(category.toString(), blog);

                return blog;
            };

            async searchBlogs(query: string): Promise<Blog[]> {

                        this.blogs_search = `blogs_search_${query}`;
                        const cachedData = await this.cacheService.get(this.blogs_search.toString());
                        if (cachedData) return cachedData;

                        const blogs = await this.blogModel.find({
                                    $or: [
                                                { title:      { $regex: query, $options: 'i' } },
                                                { slug:       { $regex: query, $options: 'i' } },
                                                { categories: { $regex: query, $options: 'i' } },
                                                { content:    { $regex: query, $options: 'i' } },
                                    ],
                        });

                        if (!blogs || blogs.length === 0) {
                                    throw new NotFoundException('Blogs not found');
                        };

                        await this.cacheService.set(this.blogs_search.toString(), blogs);  

                        return blogs;
            };

            async likes(user_id: string, blog_id: string): Promise<Blog> {
                        const blog = await this.blogModel.findById(blog_id);
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

                        await this.cacheService.reset();
                    
                        const updatedBlog = await this.blogModel.findByIdAndUpdate(blog_id, updateOperations, { new: true });
                        return updatedBlog;
            }; 

            async dislikes(user_id: string, blog_id: string): Promise<Blog> {
                        const blog = await this.blogModel.findById(blog_id);
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

                        await this.cacheService.reset();
                    
                        const updatedBlog = await this.blogModel.findByIdAndUpdate(blog_id, updateOperations, { new: true });
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

                        await this.cacheService.reset();
                        
                        const updatedBlog = await this.userModel.findByIdAndUpdate(user._id, updateOperations, {  new: true});
                        return updatedBlog;
            };

            async update(id: string, data: UpdateBlogDto): Promise<Blog> {
                        const blog = await this.blogModel.findByIdAndUpdate(id, { 
                                    ...data, 
                                    images: this.cloudinaryService.updateBlogImage(data.images.public_id, data.images.url),
                        }, { new: true }).lean();
                        if (!blog) throw new NotFoundException(`Blog id: ${id} not found`);

                        await this.cacheService.reset();

                        return blog;
            };

            async delete(id: string): Promise<Blog> {
                        const blog = await this.blogModel.findByIdAndDelete(id).lean();
                        if (!blog) throw new NotFoundException(`Blog id: ${id} not found`);

                        this.cloudinaryService.deleteBlogImage(blog.images.public_id)
                        await this.cacheService.reset();

                        return blog;
            };
}; 