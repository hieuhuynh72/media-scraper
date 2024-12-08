import { Inject, Injectable, Logger } from '@nestjs/common';
import * as cheerio from 'cheerio';
import { IScraperRepository } from './scraper.interface';
import { SCRAPER_CONSTANTS } from './scraper.constant';
import { GetMediaQueryDto, UrlArrayDto } from './scraper.dto';

@Injectable()
export class ScraperService {
  private readonly logger = new Logger(ScraperService.name);

  constructor(
    @Inject(SCRAPER_CONSTANTS.SCRAPER_REPOSITORY)
    private readonly scraperRepository: IScraperRepository,
  ) {}

  // Method to get media from the repository
  async getPaginatedMedia(getMediaQueryDto: GetMediaQueryDto) {
    return this.scraperRepository.getPaginatedMedia(
      getMediaQueryDto.urls,
      getMediaQueryDto.type,
      getMediaQueryDto.search,
      getMediaQueryDto.page,
      getMediaQueryDto.limit,
    );
  }

  async saveUrls(urlArrayDto: UrlArrayDto): Promise<void> {
    try {
      await this.scraperRepository.saveUrls(urlArrayDto.urls);
    } catch (error) {
      this.logger.error(
        `Failed to save URLs to the repository: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  /**
   * Scrapes media from an array of URLs.
   * @param urls - Array of URLs to scrape.
   */
  async scrapeMedia(
    urls: string[],
  ): Promise<{ success: boolean; message: string }> {
    try {
      // Extract media from each URL
      for (const url of urls) {
        const media = await this.extractMediaFromUrl(url);
        await this.scraperRepository.saveMedia(
          media.map((m) => ({
            ...m,
            source_url: m.sourceUrl,
            created_at: new Date(),
            status: 'ready',
          })),
        );
      }

      return { success: true, message: 'Media scraped successfully' };
    } catch (error) {
      this.logger.error(
        `Failed to scrape media from URLs: ${error.message}`,
        error.stack,
      );
      return { success: false, message: 'Failed to scrape media' };
    }
  }

  async getUrlsReadyOrTimedOut(): Promise<string[]> {
    return this.scraperRepository.getUrlsReadyOrTimedOut();
  }

  async updateUrlsStatus(urls: string[], status: string): Promise<void> {
    try {
      await this.scraperRepository.updateUrlsStatus(urls, status);
    } catch (error) {
      this.logger.error(
        `Failed to update URLs status: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async getData(url: string) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }

      return await response.text();
    } catch (error) {
      console.error(error.message);
    }
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
      const response = (await this.getData(url)) || '';
      const $ = cheerio.load(response);
      const media: { url: string; type: string; sourceUrl: string }[] = [];
      // Extract images
      $('img').each((_, element) => {
        const src = $(element).attr('src');
        if (src && !src.startsWith('data:')) {
          media.push({
            url: new URL(src, url).toString(),
            type: 'image',
            sourceUrl: url,
          });
        }
      });

      // Extract videos
      $('video').each((_, element) => {
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
