import { Controller, Post, Body, UsePipes } from '@nestjs/common';
import { ScraperService } from './scraper.service';
import { ZodValidationPipe } from './scaper.pipe';
import { UrlArrayDto, urlArraySchema } from './scraper.dto';

@Controller('scraper')
export class ScraperController {
  constructor(private readonly scraperService: ScraperService) {}

  @Post()
  @UsePipes(new ZodValidationPipe(urlArraySchema))
  async scrape(@Body() urls: UrlArrayDto) {
    console.log('Scraping URLs:', urls);
    // Call the service to scrape media from the URLs
    const result = await this.scraperService.scrapeMedia(urls);
    return result;
  }
}
