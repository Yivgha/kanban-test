import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { TaskStatus } from '../enums/TaskStatus.enum';

interface ITask {
  id?: number;
  title: string;
  description?: string;
  status: TaskStatus;
  order?: number;
}

@Entity('Tasks')
export class Task implements ITask {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({
    type: 'enum',
    enum: TaskStatus,
    default: TaskStatus.TODO,
  })
  status: TaskStatus;

  @Column({ type: 'int', nullable: true })
  order?: number;

  constructor(title: string, description?: string, order?: number) {
    this.title = title;
    this.description = description;
    this.status = TaskStatus.TODO;
    this.order = order;
  }
}
