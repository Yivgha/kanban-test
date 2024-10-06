import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { TaskStatus } from '../enums/TaskStatus.enum';
import { Kanban } from './Kanban';

@Entity('Tasks')
export class Task {
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

  // Many tasks belong to one Kanban
  @ManyToOne(() => Kanban, (kanban) => kanban.tasks, { onDelete: 'CASCADE' })
  kanban!: Kanban;

  constructor(title: string, description?: string, order?: number) {
    this.title = title;
    this.description = description;
    this.status = TaskStatus.TODO;
    this.order = order;
  }
}
