import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ScraperModule } from './scraper/scraper.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { Medias } from './scraper/model/medias.model';
import { JobsModule } from './jobs/jobs.module';
import { Urls } from './scraper/model/urls.model';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { Requests } from './scraper/model/request.model';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
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
      models: [Requests, Urls, Medias], // Register models
      define: {
        underscored: true, // Use snake_case for all columns
      },
      synchronize: true, // Sync models with the database (not for production)
    }),
    SequelizeModule.forFeature([Requests, Urls, Medias]),
    UsersModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
