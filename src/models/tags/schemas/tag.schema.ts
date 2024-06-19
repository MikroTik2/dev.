import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';

export type TagDocument = Tag & Document;

@Schema({ timestamps: true, suppressReservedKeysWarning: true })
export class Tag {
     @ApiProperty({ description: 'The title of the tag', example: 'Technology' })
     @Prop({ required: true, unique: true })
     title: string;

     @ApiProperty({ description: 'The description of the tag', example: 'Tags related to technology and gadgets' })
     @Prop({ required: false })
     description: string;

     @ApiProperty({ description: 'The image URL associated with the tag', example: 'http://example.com/image.png' })
     @Prop({ required: false, type: { public_id: String, url: String }  })
     image?: {
          public_id: string;
          url: string;
     };

     @ApiProperty({ description: 'The color code for the tag', example: '#ff5733' })
     @Prop({ required: false, default: '#222222' })
     color: string;
     
     @ApiProperty({ description: 'The number of posts associated with this tag', example: 42 })
     @Prop({ required: false, default: 0 })
     posts: number;
};

export const TagSchema = SchemaFactory.createForClass(Tag);
TagSchema.set('suppressReservedKeysWarning', true);