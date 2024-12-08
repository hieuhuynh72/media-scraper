import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { Requests } from './request.model';

@Table({
  tableName: 'urls',
})
export class Urls extends Model {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  url: string; // The URL being tracked

  @Column({
    type: DataType.ENUM('ready', 'in-progress', 'completed', 'failed'),
    allowNull: false,
    defaultValue: 'ready', // Default status when the record is created
  })
  status: 'ready' | 'in-progress' | 'completed' | 'failed';

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  error: string; // Optional field to store error messages if the status is 'failed'

  @ForeignKey(() => Requests)
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  request_id: string; // The URL from which the media was scraped

  @BelongsTo(() => Requests)
  source: Requests; // Establish the relationship with the Requests table
}
