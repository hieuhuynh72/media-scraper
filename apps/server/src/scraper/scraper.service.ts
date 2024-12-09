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

  /**
   * Retrieves paginated media based on the provided query parameters.
   *
   * @param {GetMediaQueryDto} getMediaQueryDto - The DTO containing query parameters for fetching media.
   * @returns {Promise<any>} A promise that resolves to the paginated media data.
   */
  async getPaginatedMedia(getMediaQueryDto: GetMediaQueryDto): Promise<any> {
    return this.scraperRepository.getPaginatedMedia(
      getMediaQueryDto.urls,
      getMediaQueryDto.type,
      getMediaQueryDto.search,
      getMediaQueryDto.page,
      getMediaQueryDto.limit,
    );
  }

  /**
   * Saves an array of URLs to the repository.
   *
   * @param {UrlArrayDto} urlArrayDto - The DTO containing an array of URLs to be saved.
   * @returns {Promise<void>} - A promise that resolves when the URLs have been saved.
   * @throws {Error} - Throws an error if saving the URLs fails.
   */
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
    return;
  }

  /**
   * Scrapes media from the provided list of IDs.
   *
   * This method retrieves URLs associated with the given IDs, extracts media from those URLs,
   * and saves the extracted media to the repository. If the process is successful, it returns
   * an object indicating success and a success message. If an error occurs, it logs the error
   * and returns an object indicating failure and a failure message.
   *
   * @param ids - An array of strings representing the IDs to scrape media from.
   * @returns A promise that resolves to an object containing a success boolean and a message string.
   */
  async scrapeMedia(
    ids: string[],
  ): Promise<{ success: boolean; message: string }> {
    try {
      // Extract media from URLs
      const urls = await this.scraperRepository.getUrlsByIds(ids);
      const media = await this.extractMediaFromUrls(urls);
      await this.scraperRepository.saveMedia(
        media.map((m) => ({
          ...m,
          source_url: m.sourceUrl,
          created_at: new Date(),
        })),
      );

      return { success: true, message: 'Media scraped successfully' };
    } catch (error) {
      this.logger.error(
        `Failed to scrape media from URLs: ${error.message}`,
        error.stack,
      );
      return { success: false, message: 'Failed to scrape media' };
    }
  }

  /**
   * Retrieves a list of URL IDs that are either ready or have timed out.
   *
   * @returns {Promise<string[]>} A promise that resolves to an array of URL IDs.
   */
  async getUrlIdsReadyOrTimedOut(): Promise<string[]> {
    return this.scraperRepository.getUrlIdsReadyOrTimedOut();
  }

  /**
   * Updates the status of the URLs identified by the given IDs.
   *
   * @param ids - An array of URL IDs whose status needs to be updated.
   * @param status - The new status to be applied to the URLs.
   * @returns A promise that resolves when the update operation is complete.
   * @throws Will throw an error if the update operation fails.
   */
  async updateUrlsStatus(ids: string[], status: string): Promise<void> {
    try {
      await this.scraperRepository.updateUrlsStatus(ids, status);
    } catch (error) {
      this.logger.error(
        `Failed to update URLs status: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  /**
   * Fetches data from the given URL and returns it as a string.
   * If the fetch operation fails or the response is not OK, logs an error and returns undefined.
   *
   * @param {string} url - The URL to fetch data from.
   * @returns {Promise<string | undefined>} - A promise that resolves to the fetched data as a string, or undefined if an error occurs.
   */
  async getData(url: string): Promise<string | undefined> {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }

      return await response.text();
    } catch (error) {
      this.logger.error('Failed to fetch data:', error.message);
    }
  }

  /**
   * Extracts media (images and videos) from the given URLs.
   *
   * @param urls - An array of URLs to scrape for media.
   * @returns A promise that resolves to an array of objects, each containing:
   *   - `url`: The URL of the media.
   *   - `type`: The type of the media ('image' or 'video').
   *   - `sourceUrl`: The source URL from which the media was extracted.
   * @throws Will throw an error if fetching or parsing data from any URL fails.
   */
  private async extractMediaFromUrls(
    urls: string[],
  ): Promise<Array<{ url: string; type: string; sourceUrl: string }>> {
    try {
      const media: { url: string; type: string; sourceUrl: string }[] = [];

      for (const url of urls) {
        const response = (await this.getData(url)) || '';
        const $ = cheerio.load(response);

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
      }

      return media;
    } catch (error) {
      this.logger.error(
        `Failed to fetch or parse data from ${urls}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }
}
