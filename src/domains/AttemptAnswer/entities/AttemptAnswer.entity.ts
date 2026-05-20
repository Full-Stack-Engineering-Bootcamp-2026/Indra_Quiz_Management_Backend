import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  OneToMany,
  Generated,
} from "typeorm";

import { QuizAttempt } from "../../QuizAttempt/entities/QuizAttempt.entity";
import { Question } from "../../Question/entities/question.entity";
import { QuestionVersion } from "../../QuestionVersion/entities/QuestionVersion.entity";
import { AttemptAnswerOption } from "../../AttemptAnswerOption/entities/AttemptAnswerOption.entity";

@Entity("attempt_answers")
export class AttemptAnswer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  @Generated("uuid")
  publicId: string;

  @ManyToOne(() => QuizAttempt, (attempt) => attempt.answers, {
    nullable: false,
    onDelete: "CASCADE",
  })
  attempt: QuizAttempt;

  @ManyToOne(() => Question, {
    nullable: false,
  })
  question: Question;

  @ManyToOne(
    () => QuestionVersion,
    (questionVersion) => questionVersion.attemptAnswers,
    {
      nullable: false,
    },
  )
  questionVersion: QuestionVersion;

  @Column({
    type: "text",
    nullable: true,
  })
  answerText: string;

  @Column({
    type: "text",
  })
  questionTextSnapshot: string;

  @Column({
    type: "int",
  })
  versionNumberSnapshot: number;

  @Column({
    type: "varchar",
  })
  answerTypeSnapshot: string;

  @Column({
    type: "json",
    nullable: true,
  })
  optionsSnapshot: {
    publicId: string;
    optionText: string;
  }[];

  @OneToMany(
    () => AttemptAnswerOption,
    (attemptAnswerOption) => attemptAnswerOption.attemptAnswer,
    {
      cascade: true,
    },
  )
  selectedOptions: AttemptAnswerOption[];
}
