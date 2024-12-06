import { Controller, Post, Body, UsePipes, Get, Query } from '@nestjs/common';
import { ScraperService } from './scraper.service';
import { ZodValidationPipe } from './scaper.pipe';
import { UrlArrayDto, urlArraySchema } from './scraper.dto';

@Controller('scraper')
export class ScraperController {
  constructor(private readonly scraperService: ScraperService) {}

  // Endpoint to fetch media from the database
  @Get('media')
  async getMedia(
    @Query('type') type?: string,
    @Query('search') search?: string,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    return this.scraperService.getPaginatedMedia(type, search, page, limit);
  }

  @Post()
  @UsePipes(new ZodValidationPipe(urlArraySchema))
  async scrape(@Body() urls: UrlArrayDto) {
    console.log('Scraping URLs:', urls);
    // Call the service to scrape media from the URLs
    const result = await this.scraperService.scrapeMedia(urls);
    return result;
  }
}
