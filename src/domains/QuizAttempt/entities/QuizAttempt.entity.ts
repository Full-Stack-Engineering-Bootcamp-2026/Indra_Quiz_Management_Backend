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
import { Quiz } from "../../Quiz/entities/Quiz.entity";
import { AttemptAnswer } from "../../AttemptAnswer/entities/AttemptAnswer.entity";

@Entity("quiz_attempts")
export class QuizAttempt {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  @Generated("uuid")
  publicId: string;

  @ManyToOne(() => User, (user) => user.attempts, {
    nullable: false,
  })
  user: User;

  @ManyToOne(() => Quiz, (quiz) => quiz.attempts, {
    nullable: false,
  })
  quiz: Quiz;

  @Index()
  @Column()
  attemptNumber: number;

  @OneToMany(() => AttemptAnswer, (answer) => answer.attempt, {
    cascade: true,
  })
  answers: AttemptAnswer[];

  @CreateDateColumn()
  submittedAt: Date;
}
