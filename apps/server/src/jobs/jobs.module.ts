import { Module } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { ScraperModule } from 'src/scraper/scraper.module';
import { RedisService } from 'src/redis/redis.service';

@Module({
  imports: [ScraperModule],
  providers: [JobsService, RedisService],
  exports: [JobsService], // Export it to use in other modules
})
export class JobsModule {}
