import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { DatabaseService } from '@/providers/database/mongo/database.service';
import { DatabaseModule } from '@/providers/database/mongo/database.module';

import { UsersModule } from '@/models/users/users.module';
import { AuthModule } from '@/authentication/auth.module';
import { TagsModule } from '@/models/tags/tags.module';
import { MailsModule } from '@/providers/mails/mails.module';
import { BlogsModule } from '@/models/blogs/blogs.module';
import { MediaModule } from '@/models/media/media.module';

import { ErrorsInterceptor } from '@/common/interceptors/errors.interceptor';

import configs from '@/config/index';

@Module({
    imports: [

        ConfigModule.forRoot({
            load: configs,
            isGlobal: true,
        }), 

        MongooseModule.forRootAsync({
            inject: [DatabaseService],
            imports: [DatabaseModule],
            useFactory: (databaseService: DatabaseService) => databaseService.createMongooseOptions(),
        }),

        BlogsModule,
        MediaModule,
        UsersModule,
        AuthModule,
        TagsModule,
        MailsModule,
    ],

    providers: [
        {
            provide: APP_INTERCEPTOR,
            useClass: ErrorsInterceptor,
        }
    ]
})

export class AppModule {};