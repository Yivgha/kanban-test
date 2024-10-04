import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { TaskStatus } from '../enums/task.enum';

interface ITask {
  id?: number;
  title: string;
  description?: string;
  status: TaskStatus;
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

  constructor(title: string, description?: string) {
    this.title = title;
    this.description = description;
    this.status = TaskStatus.TODO;
  }
}
