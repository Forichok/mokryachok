import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
} from "typeorm";

@Entity()
export class Product {
  @PrimaryGeneratedColumn("uuid")
  _id: string;

  @Column()
  name: string;

  @Column()
  unit: number;

  @Column()
  category: string;

  @CreateDateColumn()
  created_at: string;

  @UpdateDateColumn()
  updated_at: string;
}

@Entity()
export class Group {
  @PrimaryGeneratedColumn("uuid")
  _id: string;

  @Column()
  name: string;

  @OneToMany(() => Student, (student) => student.group)
  students: Student[];
}


@Entity()
export class Student {
  @PrimaryGeneratedColumn("uuid")
  _id: string;

  @Column()
  full_name: string;

  @OneToMany(() => Task, (task) => task.student)
  tasks: Task[];

  @ManyToOne(() => Group, (group) => group.students)
  group: Group;
}

@Entity()
export class Task {
  @PrimaryGeneratedColumn("uuid")
  _id: string;

  @Column()
  comment: string;

  @Column()
  status: string;

  @CreateDateColumn()
  task_file: string;

  @OneToMany(() => TaskAttempt, (attempt) => attempt.task)
  attempts: TaskAttempt[];

  @ManyToOne(() => Student, (student) => student.tasks)
  student: Student;
}


@Entity()
export class TaskAttempt {
  @PrimaryGeneratedColumn("uuid")
  _id: string;

  @Column()
  task_id: string;

  @Column()
  student_file: string;

  @CreateDateColumn()
  teachter_file: string;

  @Column()
  max_mark: number;

  @Column()
  mark: number;

  @Column()
  status: string;

  @CreateDateColumn()
  created_at: string;

  @ManyToOne(() => Task, (task) => task.attempts)
  task: Task;
}