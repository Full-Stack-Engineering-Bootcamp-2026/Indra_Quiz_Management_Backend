import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  Column,
  Index,
  Generated,
} from "typeorm";

import { User } from "../../User/entities/user.entity";
import { QuestionVersion } from "../../QuestionVersion/entities/QuestionVersion.entity";
import { QuizQuestion } from "../../QuizQuestion/entities/QuizQuestion.entity";

@Entity("questions")
export class Question {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  @Generated("uuid")
  publicId: string;

  @ManyToOne(() => User, (user) => user.questions, {
    nullable: false,
  })
  createdBy: User;

  @OneToMany(() => QuestionVersion, (version) => version.question)
  versions: QuestionVersion[];

  @OneToMany(() => QuizQuestion, (quizQuestion) => quizQuestion.question)
  quizQuestions: QuizQuestion[];

  @Index()
  @Column({
    default: false,
  })
  isDeleted: boolean;

  @CreateDateColumn()
  createdAt: Date;
}
