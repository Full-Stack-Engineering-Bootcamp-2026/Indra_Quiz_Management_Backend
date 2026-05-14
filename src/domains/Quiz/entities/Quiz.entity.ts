import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  Generated,
} from "typeorm";

import { User } from "../../User/entities/user.entity";
import { QuizQuestion } from "../../QuizQuestion/entities/QuizQuestion.entity";
import { QuizAttempt } from "../../QuizAttempt/entities/QuizAttempt.entity";

@Entity("quizzes")
export class Quiz {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  @Generated("uuid")
  publicId: string;

  @Column({
    length: 200,
  })
  title: string;

  @ManyToOne(() => User, (user) => user.quizzes, {
    nullable: false,
  })
  createdBy: User;

  @OneToMany(() => QuizQuestion, (quizQuestion) => quizQuestion.quiz, {
    cascade: true,
  })
  quizQuestions: QuizQuestion[];

  @OneToMany(() => QuizAttempt, (attempt) => attempt.quiz)
  attempts: QuizAttempt[];

  @CreateDateColumn()
  createdAt: Date;
}
