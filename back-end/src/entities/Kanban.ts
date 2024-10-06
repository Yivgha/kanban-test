import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Task } from './Task';
import { v4 as uuidv4 } from 'uuid';

@Entity('Kanbans')
export class Kanban {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 255 })
  name!: string;

  @Column({ type: 'varchar', unique: true, length: 36 })
  uniqueId!: string;

  // One Kanban has many Tasks
  @OneToMany(() => Task, (task) => task.kanban, { cascade: true })
  tasks!: Task[];

  constructor(name: string) {
    this.name = name;
    this.uniqueId = uuidv4();
  }
}
