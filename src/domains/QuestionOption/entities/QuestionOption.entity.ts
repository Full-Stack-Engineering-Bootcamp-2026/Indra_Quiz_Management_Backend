import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  Generated,
} from "typeorm";

import { QuestionVersion } from "../../QuestionVersion/entities/QuestionVersion.entity";
import { AttemptAnswerOption } from "../../AttemptAnswerOption/entities/AttemptAnswerOption.entity";

@Entity("question_options")
export class QuestionOption {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  @Generated("uuid")
  publicId: string;

  @ManyToOne(
    () => QuestionVersion,
    (questionVersion) => questionVersion.options,
    {
      nullable: false,
      onDelete: "CASCADE",
    },
  )
  questionVersion: QuestionVersion;

  @Column({
    type: "varchar",
    length: 255,
  })
  optionText: string;

  @ManyToOne(
    () => AttemptAnswerOption,
    (attemptAnswerOption) => attemptAnswerOption.questionOption,
    {
      nullable: true,
    },
  )
  selectedInAnswers: AttemptAnswerOption[];

  @CreateDateColumn()
  createdAt: Date;
}
