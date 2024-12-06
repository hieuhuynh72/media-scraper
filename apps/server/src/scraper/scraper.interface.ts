import { Media } from './scraper.model';

export interface IScraperRepository {
  saveMedia(
    mediaData: { url: string; type: string; sourceUrl: string }[],
  ): Promise<Media[]>;

  getPaginatedMedia(
    type?: string,
    search?: string,
    page?: number,
    limit?: number,
  ): Promise<{ data: Media[]; total: number }>;
}
