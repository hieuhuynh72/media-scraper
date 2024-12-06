import { Inject, Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { IScraperRepository } from './scraper.interface';
import { SCRAPER_CONSTANTS } from './scraper.constant';
import { UrlArrayDto } from './scraper.dto';

@Injectable()
export class ScraperService {
  private readonly logger = new Logger(ScraperService.name);

  constructor(
    @Inject(SCRAPER_CONSTANTS.SCRAPER_REPOSITORY)
    private readonly scraperRepository: IScraperRepository,
  ) {}

  // Method to get media from the repository
  async getPaginatedMedia(
    type?: string,
    search?: string,
    page = 1,
    limit = 10,
  ) {
    return this.scraperRepository.getPaginatedMedia(type, search, page, limit);
  }

  /**
   * Scrapes media from an array of URLs.
   * @param dto - DTO containing the array of URLs.
   */
  async scrapeMedia(
    dto: UrlArrayDto,
  ): Promise<{ success: boolean; message: string }> {
    const { urls } = dto; // Destructure URLs from DTO

    for (const url of urls) {
      try {
        this.logger.log(`Scraping URL: ${url}`);
        const media = await this.extractMediaFromUrl(url);
        if (media.length > 0) {
          this.logger.log(`Saving ${media.length} media items from ${url}`);
          await this.scraperRepository.saveMedia(media);
        } else {
          this.logger.warn(`No media found at ${url}`);
        }
      } catch (error) {
        this.logger.error(
          `Error scraping ${url}: ${error.message}`,
          error.stack,
        );
      }
    }

    return { success: true, message: 'Scraping completed successfully!' };
  }

  /**
   * Extracts media (images and videos) from a single URL.
   * @param url - URL to scrape.
   * @returns Array of media objects with `url`, `type`, and `sourceUrl`.
   */
  private async extractMediaFromUrl(
    url: string,
  ): Promise<{ url: string; type: string; sourceUrl: string }[]> {
    try {
      const response = await axios.get(url);
      const $ = cheerio.load(response.data);
      const media: { url: string; type: string; sourceUrl: string }[] = [];

      // Extract images
      $('img').each((_, element) => {
        const src = $(element).attr('src');
        if (src) {
          media.push({
            url: new URL(src, url).toString(),
            type: 'image',
            sourceUrl: url,
          });
        }
      });

      // Extract videos
      $('video source').each((_, element) => {
        const src = $(element).attr('src');
        if (src) {
          media.push({
            url: new URL(src, url).toString(),
            type: 'video',
            sourceUrl: url,
          });
        }
      });

      return media;
    } catch (error) {
      this.logger.error(
        `Failed to fetch or parse data from ${url}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }
}
