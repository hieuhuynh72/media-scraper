import * as BeeQueue from 'bee-queue';
import { chunk } from 'lodash';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { RedisService } from '../redis/redis.service';
import { ScraperService } from '../scraper/scraper.service';

interface JobData {
  ids: string[];
}

@Injectable()
export class JobsService implements OnModuleInit {
  private queues: BeeQueue<JobData>[] = [];

  constructor(
    private readonly scraperService: ScraperService,
    private readonly redisService: RedisService,
  ) {
    this.createQueues();
  }

  /**
   * Creates and initializes queues for job processing.
   *
   * This method sets up multiple queues with predefined names and
   * connects them to a Redis client. The queues are then stored
   * in the `queues` array for later use.
   *
   * @private
   */
  private createQueues() {
    const queueNames = [
      'scrapingQueue-1',
      'scrapingQueue-2',
      'scrapingQueue-3',
    ]; // Add your queue names here
    for (const name of queueNames) {
      const queue = new BeeQueue<JobData>(name, {
        redis: this.redisService.getClient(),
      });

      this.queues.push(queue);
    }
  }

  // Initialize the queue processor on app startup
  onModuleInit() {
    // Process jobs specific to this queue
    for (const queue of this.queues) {
      queue.process(async (job) => {
        console.log(`Processing job ${job.id} with URL:`, job.data.ids);

        try {
          // Process the job using the scraper service
          const result = await this.scraperService.scrapeMedia(job.data.ids);

          // Update job status or store result in Redis/Postgres
          if (result.success) {
            await this.scraperService.updateUrlsStatus(
              job.data.ids,
              'completed',
            );
          } else {
            await this.scraperService.updateUrlsStatus(job.data.ids, 'failed');
          }
          console.log(`Job ${job.id} completed successfully`);
        } catch (error) {
          console.error(
            `Job ${job.id} failed with URL: ${job.data.ids}. Error:`,
            error,
          );
        }

        return 'done';
      });
    }
  }

  @Cron(CronExpression.EVERY_30_SECONDS)
  /**
   * Handles the cron job execution.
   *
   * This method retrieves URL IDs that are either ready or have timed out,
   * and then sends these URL IDs in batches to a queue for further processing.
   *
   * @returns {Promise<void>} A promise that resolves when the cron job handling is complete.
   */
  async handleCron() {
    const urlIdsToProcess = await this.getUrlIdsReadyOrTimedOut();

    // Send URL Ids in batches to the queue
    const batchSize = 10; // Adjust the batch size as needed
    for (const ids of chunk(urlIdsToProcess, batchSize)) {
      await this.enqueueUrls(ids);
    }
  }

  /**
   * Retrieves a list of URL IDs that are either ready or have timed out.
   *
   * @returns {Promise<string[]>} A promise that resolves to an array of URL IDs.
   */
  private async getUrlIdsReadyOrTimedOut(): Promise<string[]> {
    return this.scraperService.getUrlIdsReadyOrTimedOut();
  }

  /**
   * Retrieves a queue from the list of available queues in a round-robin fashion.
   * If no queues are available, an error is thrown.
   *
   * @returns {BeeQueue<JobData>} The next available queue.
   * @throws {Error} If no queues are available.
   */
  private getQueue(): BeeQueue<JobData> {
    if (this.queues.length === 0) {
      throw new Error('No queues available');
    }
    const queue = this.queues.shift();
    this.queues.push(queue!);
    return queue!;
  }

  /**
   * Enqueues a list of URLs for processing by creating a job in the queue.
   *
   * @param ids - An array of URL IDs to be processed.
   * @returns A promise that resolves when the job is saved and the URLs' status is updated.
   *
   * @remarks
   * This method performs the following steps:
   * 1. Retrieves the queue instance.
   * 2. Creates a job with the provided URL IDs.
   * 3. Saves the job to the queue.
   * 4. Updates the status of the URLs to "in-progress".
   * 5. Logs the job creation details to the console.
   */
  private async enqueueUrls(ids: string[]) {
    const queue = this.getQueue();
    const job = queue.createJob({ ids });
    await job.save();

    // Update the status of the URLs to "processing"
    await this.scraperService.updateUrlsStatus(ids, 'in-progress');

    console.log(`Job created with ID: ${job.id} for URLs: ${ids}`);
  }
}
