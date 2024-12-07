import * as BeeQueue from 'bee-queue';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { RedisService } from 'src/redis/redis.service';
import { ScraperService } from 'src/scraper/scraper.service';

@Injectable()
export class JobsService implements OnModuleInit {
  private queue: BeeQueue<any>;

  constructor(
    private readonly scraperService: ScraperService,
    private readonly redisService: RedisService,
  ) {
    // Create a queue
    this.queue = new BeeQueue(`scrapingQueue-${process.pid}`, {
      redis: {
        host: 'localhost',
        port: 6379,
      },
      isWorker: true,
    });
  }

  // Initialize the queue processor on app startup
  onModuleInit() {
    console.log(`Worker started for queue: ${this.queue.name}`);

    // Process jobs specific to this queue
    this.queue.process(async (job) => {
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

  // This will run every minute
  @Cron(CronExpression.EVERY_30_SECONDS)
  async handleCron() {
    console.log(
      `Fetching ready and timed-out URLs for queue: ${this.queue.name}`,
    );

    const urlsToProcess = await this.getUrlsReadyOrTimedOut();

    // Send URLs in batches to the queue
    const batchSize = 10; // Adjust the batch size as needed
    for (let i = 0; i < urlsToProcess.length; i += batchSize) {
      const urls = urlsToProcess.slice(i, i + batchSize);
      await this.enqueueUrls(urls);
    }
  }

  // Fetch URLs that are "ready" and timed out
  private async getUrlsReadyOrTimedOut(): Promise<string[]> {
    return this.scraperService.getUrlsReadyOrTimedOut();
  }

  // Add URLs to the job queue
  private async enqueueUrls(urls: string[]) {
    const job = this.queue.createJob({ urls });
    await job.save();

    // update the status of the URLs to "processing"
    await this.scraperService.updateUrlsStatus(urls, 'in-progress');

    console.log(`Job created for URL: ${urls}`);
  }
}
