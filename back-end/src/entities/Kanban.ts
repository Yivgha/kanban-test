import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Task } from './Task';

@Entity('Kanbans')
export class Kanban {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 255 })
  name!: string;

  // One Kanban has many Tasks
  @OneToMany(() => Task, (task) => task.kanban, { cascade: true })
  tasks!: Task[];

  constructor(name: string) {
    this.name = name;
  }
}
