import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { IScraperRepository } from './scraper.interface';
import { Medias } from './model/medias.model';
import { Urls } from './model/urls.model';
import { Requests } from './model/request.model';

export class PostGresRepository implements IScraperRepository {
  constructor(
    @InjectModel(Medias)
    private mediaModel: typeof Medias,
    @InjectModel(Urls)
    private urlsModel: typeof Urls,
    @InjectModel(Requests)
    private requetsModel: typeof Requests,
  ) {}

  async saveUrls(urls: string[]): Promise<void> {
    if (!this.urlsModel.sequelize) {
      throw new Error('Sequelize instance is not available');
    }

    const transaction = await this.urlsModel.sequelize.transaction();
    try {
      await this.urlsModel.bulkCreate(
        urls.map((url) => ({ url })),
        { transaction },
      );
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async saveMedia(
    mediaData: {
      url: string;
      type: string;
      sourceUrl: string;
      status: string;
      processTimeOut: Date;
    }[],
  ): Promise<Medias[]> {
    if (!this.mediaModel.sequelize) {
      throw new Error('Sequelize instance is not available');
    }

    const transaction = await this.mediaModel.sequelize.transaction();
    try {
      const media = await this.mediaModel.bulkCreate(mediaData, {
        transaction,
      });
      await transaction.commit();
      return media;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async getPaginatedMedia(
    urls: string[],
    type?: string,
    search?: string,
    page = 1,
    limit = 10,
  ): Promise<{ data: Medias[]; total: number }> {
    const where: any = {};

    if (!urls.length) {
      return { data: [], total: 0 };
    }

    where.source_url = { [Op.in]: urls };

    if (type) {
      where.type = type;
    }

    if (search) {
      where.url = { [Op.like]: `%${search}%` };
    }

    const { count, rows } = await this.mediaModel.findAndCountAll({
      where,
      limit,
      offset: (page - 1) * limit,
    });

    return { data: rows, total: count };
  }

  async getUrlsReadyOrTimedOut(): Promise<string[]> {
    const urls = await this.urlsModel.findAll({
      where: {
        status: {
          [Op.or]: ['ready', 'failed'],
        },
      },
    });

    return urls.map((url) => url.url);
  }

  async updateUrlsStatus(urls: string[], status: string): Promise<void> {
    try {
      await this.urlsModel.update(
        { status },
        {
          where: {
            url: {
              [Op.in]: urls,
            },
          },
        },
      );
    } catch (error) {
      throw error;
    }
  }
}
