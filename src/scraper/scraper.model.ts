import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({
  tableName: 'media',
})
export class Media extends Model {
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
  sourceUrl: string; // The URL from which the media was scraped
}
