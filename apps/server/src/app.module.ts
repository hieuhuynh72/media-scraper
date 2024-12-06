import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ScraperModule } from './scraper/scraper.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { Media } from './scraper/scraper.model';

@Module({
  imports: [
    ScraperModule,
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'localhost',
      password: 'postgres',
      database: 'postgres',
      models: [Media],
      autoLoadModels: true, // Automatically load models
      synchronize: true, // Sync models with the database (not for production)
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
