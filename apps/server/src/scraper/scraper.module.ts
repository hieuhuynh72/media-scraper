import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ScraperService } from './scraper.service';
import { ScraperController } from './scraper.controller';
import { Media } from './scraper.model';
import { PostGresRepository } from './scraper.repository';
import { SCRAPER_CONSTANTS } from './scraper.constant';

@Module({
  imports: [SequelizeModule.forFeature([Media])],
  controllers: [ScraperController],
  providers: [
    ScraperService,
    PostGresRepository,
    {
      provide: SCRAPER_CONSTANTS.SCRAPER_REPOSITORY,
      useClass: PostGresRepository,
    },
  ],
})
export class ScraperModule {}
