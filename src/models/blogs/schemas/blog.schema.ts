import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose, { Document } from 'mongoose';

export type BlogDocument = Blog & Document;

@Schema({ timestamps: true, suppressReservedKeysWarning: true })
export class Blog {
     @Prop({ required: true })
     title: string;

     @Prop({ required: true })
     content: string;

     @Prop({ required: true })
     content_html: string;

     @Prop({ required: true })
     categories: string;

     @Prop({ required: true })
     tags: string[];

     @Prop({ required: true })
     summary: string;

     @Prop()
     slug: string;

     @Prop()
     dislikes: string[];

     @Prop()
     likes: string[];

     @Prop()
     save: string[];

     @Prop({ type: { public_id: String, url: String }, required: false })
     images?: {
          public_id: string;
          url: string;
     };

     @Prop({ required: true })
     author: string;
};

export const BlogSchema = SchemaFactory.createForClass(Blog);
BlogSchema.set('suppressReservedKeysWarning', true);