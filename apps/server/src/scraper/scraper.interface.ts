import { Medias } from './model/medias.model';

export interface IScraperRepository {
  saveMedia(
    mediaData: { url: string; type: string; sourceUrl: string }[],
  ): Promise<Medias[]>;

  getPaginatedMedia(
    type?: string,
    search?: string,
    page?: number,
    limit?: number,
  ): Promise<{ data: Medias[]; total: number }>;

  saveUrls(urls: string[]): Promise<void>;

  getUrlsReadyOrTimedOut(): Promise<string[]>;

  updateUrlsStatus(urls: string[], status: string): Promise<void>;
}
