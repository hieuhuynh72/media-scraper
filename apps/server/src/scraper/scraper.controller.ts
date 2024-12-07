import { Controller, Post, Body, UsePipes, Get, Query } from '@nestjs/common';
import { ScraperService } from './scraper.service';
import { ZodValidationPipe } from './scaper.pipe';
import { UrlArrayDto, urlArraySchema } from './scraper.dto';

@Controller('scraper')
export class ScraperController {
  constructor(private readonly scraperService: ScraperService) {}

  // Endpoint to fetch media from the database
  @Get('media')
  // @UseGuards(AuthGuard('bearer'))
  async getMedia(
    @Query('type') type?: string,
    @Query('search') search?: string,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    // Call the service to fetch media
    const result = await this.scraperService.getPaginatedMedia(
      type,
      search,
      page,
      limit,
    );
    return result;
  }

  @Post('urls')
  @UsePipes(new ZodValidationPipe(urlArraySchema))
  async saveUrls(@Body() dto: UrlArrayDto) {
    try {
      await this.scraperService.saveUrls(dto);
      return { success: true, message: 'URLs saved successfully' };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }
}
