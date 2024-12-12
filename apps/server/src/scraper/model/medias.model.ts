import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { Urls } from './urls.model';

@Table({
  tableName: 'medias',
})
export class Medias extends Model {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  url: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  type: string; // 'image' or 'video'

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  source_url: string; // The URL from which the media was scraped
}
