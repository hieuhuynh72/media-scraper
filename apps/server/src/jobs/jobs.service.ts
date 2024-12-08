import * as BeeQueue from 'bee-queue';
import { chunk } from 'lodash';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { RedisService } from 'src/redis/redis.service';
import { ScraperService } from 'src/scraper/scraper.service';

@Injectable()
export class JobsService implements OnModuleInit {
  private queues: BeeQueue<any>[] = [];

  constructor(
    private readonly scraperService: ScraperService,
    private readonly redisService: RedisService,
  ) {
    // Create a queue
    for (let i = 0; i < 3; i++) {
      const queue = new BeeQueue(`scrapingQueue-${i}`, {
        redis: {
          host: 'localhost',
          port: 6379,
        },
        isWorker: true,
      });

      this.queues.push(queue);
    }
  }

  // Initialize the queue processor on app startup
  onModuleInit() {
    // Process jobs specific to this queue
    for (const queue of this.queues) {
      queue.process(async (job) => {
        console.log(`Processing job ${job.id} with URL:`, job.data.urls);

        try {
          // Process the job using the scraper service
          const result = await this.scraperService.scrapeMedia(job.data.urls);

          // Update job status or store result in Redis/Postgres
          if (result.success) {
            await this.scraperService.updateUrlsStatus(
              job.data.urls,
              'completed',
            );
          } else {
            await this.scraperService.updateUrlsStatus(job.data.urls, 'failed');
          }
          console.log(`Job ${job.id} completed successfully`);
        } catch (error) {
          console.error(`Job ${job.id} failed:`, error);
        }

        return 'done';
      });
    }
  }

  // This will run every minute
  @Cron(CronExpression.EVERY_30_SECONDS)
  async handleCron() {
    const urlsToProcess = await this.getUrlsReadyOrTimedOut();

    // Send URLs in batches to the queue
    const batchSize = 10; // Adjust the batch size as needed
    for (const urls of chunk(urlsToProcess, batchSize)) {
      await this.enqueueUrls(urls);
    }
  }

  // Fetch URLs that are "ready" and timed out
  private async getUrlsReadyOrTimedOut(): Promise<string[]> {
    return this.scraperService.getUrlsReadyOrTimedOut();
  }

  // Route to enqueue URLs
  private getQueue() {
    const queue = this.queues.shift();
    this.queues.push(queue as any);

    return queue;
  }

  // Add URLs to the job queue
  private async enqueueUrls(urls: string[]) {
    const job = this.getQueue()?.createJob({ urls });
    await job?.save();

    // update the status of the URLs to "processing"
    await this.scraperService.updateUrlsStatus(urls, 'in-progress');

    console.log(`Job created for URL: ${urls}`);
  }
}
