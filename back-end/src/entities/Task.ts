import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

interface ITask {
  id?: number;
  title: string;
  description?: string;
}

@Entity('Tasks')
export class Task implements ITask {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  constructor(title: string, description?: string) {
    this.title = title;
    this.description = description;
  }
}
