import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ScraperService } from './scraper.service';
import { ScraperController } from './scraper.controller';
import { Medias } from './model/medias.model';
import { Urls } from './model/urls.model';
import { PostGresRepository } from './scraper.repository';
import { SCRAPER_CONSTANTS } from './scraper.constant';

@Module({
  imports: [SequelizeModule.forFeature([Medias, Urls])],
  controllers: [ScraperController],
  providers: [
    ScraperService,
    PostGresRepository,
    {
      provide: SCRAPER_CONSTANTS.SCRAPER_REPOSITORY,
      useClass: PostGresRepository,
    },
  ],
  exports: [ScraperService],
})
export class ScraperModule {}
