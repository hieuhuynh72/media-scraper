import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
} from 'sequelize-typescript';

@Table({
  tableName: 'requests',
})
export class Requests extends Model {
  @PrimaryKey
  @Column({
    type: DataType.STRING,
  })
  id: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
  })
  createdAt: Date;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    defaultValue: 'in-progress',
  })
  status: string;
}
