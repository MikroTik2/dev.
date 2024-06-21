import { Injectable, Inject } from "@nestjs/common";
import { Cache } from "cache-manager";

@Injectable()
export class CacheService {
            constructor(
                        @Inject('CACHE_MANAGER') private readonly cacheManager: Cache,
            ) {};

            public async get(key: string): Promise<any> {
                return this.cacheManager.get(key);
            };

            public async set(key: string, value: any): Promise<any> {
                return this.cacheManager.set(key, value);
            };

            public async reset(): Promise<any> {
                        return this.cacheManager.reset();
            };

            public async del(key: string): Promise<any> {
                return this.cacheManager.del(key);
            };
};