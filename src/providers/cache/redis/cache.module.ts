import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { CacheService } from './cache.service';

@Module({
            imports: [
                        CacheModule.register({
                                    isGlobal: true,
                                    ttl: 30 * 1000,
                        }),
            ],

            providers: [CacheService],
            exports: [CacheService],
})

export class CacheManagerModule {};
