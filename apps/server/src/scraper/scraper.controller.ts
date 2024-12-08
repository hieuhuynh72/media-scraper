import { Controller, Post, Body, UsePipes, UseGuards } from '@nestjs/common';
import { ScraperService } from './scraper.service';
import { ZodValidationPipe } from './scaper.pipe';
import {
  GetMediaQueryDto,
  getMediaQuerySchema,
  UrlArrayDto,
  urlArraySchema,
} from './scraper.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('scraper')
export class ScraperController {
  constructor(private readonly scraperService: ScraperService) {}

  // Endpoint to fetch media from the database
  @Post('medias')
  @UseGuards(AuthGuard)
  @UsePipes(new ZodValidationPipe(getMediaQuerySchema))
  async getMedia(@Body() getMediaQueryDto: GetMediaQueryDto) {
    // Call the service to fetch media
    const result =
      await this.scraperService.getPaginatedMedia(getMediaQueryDto);
    return result;
  }

  @Post('urls')
  @UseGuards(AuthGuard)
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
