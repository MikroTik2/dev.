import 'dotenv/config';

import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestApplication, NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerCustomOptions, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from '@/app.module';

import { AppConfig } from '@/config/app.config';
import { DatabaseConfig } from '@/config/database.config';
import { OpenApiConfig } from '@/config/api.config';

import * as cookieParser from 'cookie-parser';

async function bootstrap() {
    const context = 'NestApplication';
    const logger = new Logger(context);

    const app: NestApplication = await NestFactory.create(AppModule);
    app.enableCors({ 
        origin: 'http://localhost:5173',
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        credentials: true, 
    });

    const configService = app.get(ConfigService);
    const appConfig = configService.get<AppConfig>('app');
    const dbConfig = configService.get<DatabaseConfig>('database');

    app.setGlobalPrefix(appConfig.globalPrefix);
    app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
    app.use(cookieParser());

    setupOpenAPI(app);

    app.setGlobalPrefix(appConfig.globalPrefix);

    const server = await app.listen(appConfig.http.port, appConfig.http.host);

    if (appConfig.env === 'production') {
        server.setTimeout(appConfig.timeout);
    };

    let uri = '';

    if (process.env.NODE_ENV === 'production') {
        uri = `mongodb+srv://@${dbConfig.host}/${dbConfig.name}`;
    } else if (process.env.NODE_ENV === 'development') {
        uri = `mongodb://127.0.0.1:27017/${dbConfig.name}`;
    };

    logger.debug(`Server environment set to ${appConfig.env}`);
    logger.log(`Database running on ${uri}`);
    logger.log(`Server running on ${await app.getUrl()}`);
};

bootstrap();

function setupOpenAPI(app: NestApplication) {
    const configService = app.get(ConfigService);
    const openApiConfig = configService.get<OpenApiConfig>('open-api');
    const appConfig = configService.get<AppConfig>('app');

    const config = new DocumentBuilder()
        .setTitle(openApiConfig.title)
        .setDescription(openApiConfig.description)
        .setVersion(openApiConfig.version)
        .build();

    const document = SwaggerModule.createDocument(app, config, {
        extraModels: [],
    });

    const options: SwaggerCustomOptions = {
        swaggerOptions: {
            filter: true,
            showRequestDuration: true,
        }
    };

    SwaggerModule.setup(`${appConfig.globalPrefix}`, app, document, options);
};