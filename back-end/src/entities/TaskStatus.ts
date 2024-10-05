import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { TaskStatus } from '../enums/TaskStatus.enum';

@Entity('TaskStatuses')
export class Status {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    type: 'enum',
    enum: TaskStatus,
    unique: true,
  })
  name!: TaskStatus;

  constructor(name: TaskStatus) {
    this.name = name;
  }
}
