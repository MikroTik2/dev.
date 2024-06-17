import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose, { Document } from 'mongoose';
import { Tag } from '@/models/tags/schemas/tag.schema';

export type UserDocument = User & Document;

@Schema({ timestamps: true, suppressReservedKeysWarning: true })
export class User {

     @ApiProperty({ required: true, maxLength: 60, description: 'The name of the user', example: 'john_doe' })
     @Prop({ required: true, maxlength: 60, })
     name: string;
     
     @ApiProperty({ required: true,maxLength: 60, description: 'The username of the user', example: 'MikroTik_2' })
     @Prop({ required: true, maxlength: 60, })
     username: string;

     @ApiProperty({ required: true, uniqueItems: true, description: 'The email address of the user', example: 'john@example.com' })
     @Prop({ required: true, unique: true })
     email: string;
     
     @ApiProperty({ required: true, minLength: 8, readOnly: true, description: 'The password of the user' })
     @Prop({ required: true, minlength: 8 })
     password: string;

     @ApiProperty({ enum: ['user', 'admin'], default: 'user', description: 'The role of the user', example: 'user' })
     @Prop({ enum: ['user', 'admin'], default: 'user' })
     role: string;

     @ApiProperty({ example: 'false', description: 'The blocked of the user' })
     @Prop({ default: false })
     isBlocked: boolean;

     @ApiProperty({
          example: {
               public_id: 'some_public_id',
               url: 'https://res.cloudinary.com/dn7gjjo2z/image/upload/v1710507774/avatars/oynxspnskdw8rvntb9o2.jpg'
          },

          description: 'The avatar of the user'
     })
     @Prop({ type: { public_id: String, url: String }})
     avatar: {
          public_id: string;
          url: string;
     };

     @ApiProperty({ description: 'The provider of the user', default: 'local', example: 'google', readOnly: true })
     @Prop({ required: true, default: 'local' })
     provider: string;

     @ApiProperty({ description: 'The destroy token for delete account user', example: '32iiun3nug9ubfOAKAOIR' })
     @Prop()
     destroy_token: string;

     @ApiProperty({ description: 'The token used for email verification', example: 'a1b2c3d4e5f6', readOnly: true })
     @Prop({ required: true })
     confirm_token: string

     @ApiProperty({ description: 'The status for the email verification token', example: 'true', readOnly: true })
     @Prop({ required: true, default: false })
     confirm_account: boolean;

     @ApiProperty({ description: 'The google id of the user', example: '32iiun3nug9ubfOAKAOIR' })
     @Prop()
     google_id: string;

     @ApiProperty({ description: 'The github id of the user', example: '32iiun3nug9ubfOAKAOIR' })
     @Prop()
     github_id: string;

     @ApiProperty({ description: 'The tags following id of the user', example: 'webdev, javascript' })
     @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag' }] })
     following_tags: Tag[];

     @ApiProperty({ description: 'The tags hidden id of the user', example: 'webdev, javascript' })
     @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag' }] })
     hidden_tags: Tag[];

     @ApiProperty({ description: 'The branding color for user', example: '#000000' })
     @Prop()
     brand_color: string;

     @ApiProperty({ description: 'The education of the user', example: 'Where did you go to school?' })
     @Prop({ max: 100 })
     education: string;

     @ApiProperty({ description: 'The projects of the user', example: 'Where did you go to school?' })
     @Prop({ max: 200 })
     projects: string;

     @ApiProperty({ description: 'The skills of the user', example: ['HTML', 'CSS', 'JavaScript'] })
     @Prop({ max: 200 })
     skills: string;

     @ApiProperty({ description: 'the currently learning of the user', example: 'Nestjs' })
     @Prop({ max: 200 })
     learning: string;

     @ApiProperty({ description: 'The website url for user', example: 'https://example.com' })
     @Prop()
     urls: [{
          value: string,
     }];

     @ApiProperty({ description: 'The location of the user', example: 'New York, USA' })
     @Prop({ max: 100 })
     location: string;

     @ApiProperty({ description: 'the bio description of the user', example: 'l so cool' })
     @Prop({ max: 200 })
     bio: string

     @ApiProperty({ description: 'the work of the user', example: 'What do you do? Example: CEO at ACME Inc.' })
     @Prop({ max: 100 })
     work: string;

     @Prop({ default: [], required: false })
     save_blogs: [];

     @ApiProperty({ description: 'The token used for email verification', example: 'a1b2c3d4e5f6', readOnly: true })
     @Prop()
     reset_password_token: string;

     @ApiProperty({ description: 'The expiry date for the password reset token', example: '2024-04-03T12:00:00Z', readOnly: true })
     @Prop()
     reset_password_expire: Date;
};

export const UserSchema = SchemaFactory.createForClass(User);