import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({
  tableName: 'urls',
})
export class Urls extends Model {
  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true, // URL should be unique
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
}
