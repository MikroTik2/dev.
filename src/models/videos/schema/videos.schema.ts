import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';

import mongoose, { Document } from 'mongoose';

export type VideoDocument = Video & Document;

@Schema({ timestamps: true })
export class Video {
     body_markdown: string;
     main_image: string;
     tag_list: string;
     title: string;
};

export const VideoSchema = SchemaFactory.createForClass(Video);