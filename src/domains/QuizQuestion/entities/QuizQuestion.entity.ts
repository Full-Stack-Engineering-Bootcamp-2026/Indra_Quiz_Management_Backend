import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Unique,
  Column,
  Generated,
} from "typeorm";
import { Quiz } from "../../Quiz/entities/Quiz.entity";
import { Question } from "../../Question/entities/question.entity";
@Entity("quiz_questions")
@Unique(["quiz", "question"])
export class QuizQuestion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  @Generated("uuid")
  publicId: string;

  @ManyToOne(() => Quiz, (quiz) => quiz.quizQuestions, {
    nullable: false,
    onDelete: "CASCADE",
  })
  quiz: Quiz;

  @ManyToOne(() => Question, (question) => question.quizQuestions, {
    nullable: false,
    onDelete: "CASCADE",
  })
  question: Question;
}
