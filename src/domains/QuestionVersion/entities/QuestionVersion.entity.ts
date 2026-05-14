import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  Column,
  CreateDateColumn,
  Index,
  Unique,
  Generated,
} from "typeorm";

import { Question } from "../../Question/entities/question.entity";
import { QuestionOption } from "../../QuestionOption/entities/QuestionOption.entity";
import { AttemptAnswer } from "../../AttemptAnswer/entities/AttemptAnswer.entity";

export enum AnswerType {
  SINGLE_SELECT = "single_select",
  MULTI_SELECT = "multi_select",
  TEXT = "text",
}

@Entity("question_versions")
@Unique(["question", "versionNumber"])
export class QuestionVersion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  @Generated("uuid")
  publicId: string;

  @ManyToOne(() => Question, (question) => question.versions, {
    nullable: false,
    onDelete: "CASCADE",
  })
  question: Question;

  @Index()
  @Column()
  versionNumber: number;

  @Column({
    type: "text",
  })
  questionText: string;

  @Column({
    type: "enum",
    enum: AnswerType,
  })
  answerType: AnswerType;

  @Index()
  @Column({
    default: true,
  })
  isActive: boolean;

  @OneToMany(() => QuestionOption, (option) => option.questionVersion, {
    cascade: true,
  })
  options: QuestionOption[];

  @OneToMany(
    () => AttemptAnswer,
    (attemptAnswer) => attemptAnswer.questionVersion,
  )
  attemptAnswers: AttemptAnswer[];

  @CreateDateColumn()
  createdAt: Date;
}
