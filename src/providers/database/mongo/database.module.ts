import { Module } from '@nestjs/common';
import { DatabaseService } from '@/providers/database/mongo/database.service';

@Module({
     providers: [DatabaseService],
     exports: [DatabaseService],
})

export class DatabaseModule {};