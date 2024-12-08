import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ScraperService } from './scraper.service';
import { ScraperController } from './scraper.controller';
import { Medias } from './model/medias.model';
import { Urls } from './model/urls.model';
import { PostGresRepository } from './scraper.repository';
import { SCRAPER_CONSTANTS } from './scraper.constant';
import { Requests } from './model/request.model';
import { AuthGuard } from 'src/auth/auth.guard';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [SequelizeModule.forFeature([Medias, Urls, Requests])],
  controllers: [ScraperController],
  providers: [
    ScraperService,
    PostGresRepository,
    {
      provide: SCRAPER_CONSTANTS.SCRAPER_REPOSITORY,
      useClass: PostGresRepository,
    },
    AuthGuard,
    JwtService,
  ],
  exports: [ScraperService],
})
export class ScraperModule {}
