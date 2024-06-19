import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';

import mongoose, { Document } from 'mongoose';

export type MediaDocument = Media & Document;

@Schema({ timestamps: true })
export class Media {
     @Prop({ required: true })
     title: string;

     @Prop({ required: true })
     content: string;

     @Prop({ required: true })
     content_html: string;

     @Prop({ required: true })
     categories: string;

     @Prop({ required: true })
     tags?: string[];

     @Prop({ required: true })
     summary: string;

     @Prop()
     slug: string;

     @Prop()
     dislikes: string[];

     @Prop()
     likes: string[];

     @Prop({ required: true })
     author: string;

     @Prop({ type: { public_id: String, secure_url: String }, required: true })
     video: {
          public_id: string;
          secure_url: string;
     };
};

export const MediaSchema = SchemaFactory.createForClass(Media);