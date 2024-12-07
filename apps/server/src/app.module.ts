import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ScraperModule } from './scraper/scraper.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { Medias } from './scraper/model/medias.model';
import { JobsModule } from './jobs/jobs.module';
import { Urls } from './scraper/model/urls.model';

@Module({
  imports: [
    ScraperModule,
    ScheduleModule.forRoot(),
    JobsModule,
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'localhost',
      password: 'postgres',
      database: 'postgres',
      models: [Urls, Medias], // Register models
      define: {
        underscored: true, // Use snake_case for all columns
      },
      synchronize: true, // Sync models with the database (not for production)
    }),
    SequelizeModule.forFeature([Urls, Medias]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
