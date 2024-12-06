import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { IScraperRepository } from './scraper.interface';
import { Media } from './scraper.model';

export class PostGresRepository implements IScraperRepository {
  constructor(@InjectModel(Media) private mediaModel: typeof Media) {}

  async saveMedia(
    mediaData: { url: string; type: string; sourceUrl: string }[],
  ): Promise<Media[]> {
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
    type?: string,
    search?: string,
    page = 1,
    limit = 10,
  ): Promise<{ data: Media[]; total: number }> {
    const where: any = {};

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
}
